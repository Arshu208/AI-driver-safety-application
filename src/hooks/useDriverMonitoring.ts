import { useEffect, useRef, useState, RefObject } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import Webcam from 'react-webcam';
import { useMonitoringStore } from '../store/monitoringStore';
import { useTripStore } from '../store/tripStore';
import { socket, connectSocket } from '../services/socket';
import { useAuthStore } from '../store/authStore';
import { playBlinkAlert, startCriticalAlarm } from '../services/alertAudio';

export function useDriverMonitoring(webcamRef: RefObject<Webcam | null>) {
  const setMonitoringData = useMonitoringStore((s) => s.setMonitoringData);
  const tripId = useTripStore((s) => s.tripId);
  const token = useAuthStore((s) => s.token);
  const driverId = useAuthStore((s) => s.user?.id);
  const [isAiReady, setIsAiReady] = useState(false);
  const [aiError, setAiError] = useState('');

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number>();
  const blinksRef = useRef<number[]>([]);
  const lastEyeStatusRef = useRef<'Open' | 'Closed'>('Open');
  const currentFatigueRef = useRef(0);
  
  const eyeStatesRef = useRef<{ timestamp: number; isClosed: boolean }[]>([]);
  const lastTelemetryEmitRef = useRef<number>(0);

  useEffect(() => {
    connectSocket(token || undefined);
    let active = true;
    const initializeFaceLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        if (active) {
          faceLandmarkerRef.current = faceLandmarker;
          setIsAiReady(true);
          setMonitoringData(0, 0, false, 'Detecting...', 0);
        }
      } catch (error) {
        console.error("Failed to load MediaPipe Face Landmarker", error);
        if (active) {
          setAiError('Failed to load AI model');
          setMonitoringData(0, 0, false, 'AI Load Error', 0);
        }
      }
    };
    initializeFaceLandmarker();
    return () => {
      active = false;
      faceLandmarkerRef.current?.close();
      faceLandmarkerRef.current = null;
    };
  }, [setMonitoringData, token]);

  const detectFace = () => {
    if (webcamRef.current && webcamRef.current.video && faceLandmarkerRef.current) {
      const video = webcamRef.current.video;
      if (video.readyState >= 2) {
        const startTimeMs = performance.now();
        const results = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);
        
        const now = Date.now();

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          const trackingPoints = results.faceLandmarks[0].length;
          
          if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
            const blendshapes = results.faceBlendshapes[0].categories;
            const leftEyeBlink = blendshapes.find(b => b.categoryName === 'eyeBlinkLeft')?.score || 0;
            const rightEyeBlink = blendshapes.find(b => b.categoryName === 'eyeBlinkRight')?.score || 0;
            
            const isClosed = leftEyeBlink > 0.4 && rightEyeBlink > 0.4;
            const currentStatus = isClosed ? 'Closed' : 'Open';
            
            const eyeStatusStr = isClosed ? 'Closed (Drowsy)' : 'Open & Alert';

            eyeStatesRef.current.push({ timestamp: now, isClosed });
            eyeStatesRef.current = eyeStatesRef.current.filter(state => now - state.timestamp < 60000);

            const totalFrames = eyeStatesRef.current.length;
            const closedFrames = eyeStatesRef.current.filter(s => s.isClosed).length;
            const perclos = totalFrames > 0 ? (closedFrames / totalFrames) : 0;

            if (currentStatus === 'Closed' && lastEyeStatusRef.current === 'Open') {
              blinksRef.current.push(now);
              blinksRef.current = blinksRef.current.filter(time => now - time < 60000);
              playBlinkAlert();
            }
            lastEyeStatusRef.current = currentStatus;
            
            const blinkRate = blinksRef.current.length;

            if (perclos > 0.15) {
              currentFatigueRef.current = Math.min(currentFatigueRef.current + 2, 100);
            } else if (isClosed) {
              currentFatigueRef.current = Math.min(currentFatigueRef.current + 0.5, 100);
            } else {
              currentFatigueRef.current = Math.max(currentFatigueRef.current - 0.2, 0);
            }
            
            const fatigueLevel = currentFatigueRef.current;
            const isDrowsy = fatigueLevel > 70 || perclos > 0.20;

            if (fatigueLevel >= 100) {
              startCriticalAlarm();
            }

            setMonitoringData(fatigueLevel, blinkRate, isDrowsy, eyeStatusStr, trackingPoints);

            if (now - lastTelemetryEmitRef.current > 1000 && tripId) {
              socket.emit('driverTelemetry', {
                driverId,
                tripId,
                fatigueLevel: Math.round(fatigueLevel),
                blinkRate,
                perclos: (perclos * 100).toFixed(1),
                isDrowsy,
                timestamp: new Date().toISOString()
              });
              lastTelemetryEmitRef.current = now;
            }
          }
        } else {
          setMonitoringData(currentFatigueRef.current, blinksRef.current.length, currentFatigueRef.current > 70, 'No Face Detected', 0);
        }
      }
    }
    requestRef.current = requestAnimationFrame(detectFace);
  };

  const resetFatigue = () => {
    currentFatigueRef.current = 0;
    eyeStatesRef.current = [];
    setMonitoringData(0, blinksRef.current.length, false, 'Open & Alert', 0);
  };

  useEffect(() => {
    if (isAiReady) {
      requestRef.current = requestAnimationFrame(detectFace);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isAiReady, webcamRef, setMonitoringData]);

  return { isAiReady, aiError, resetFatigue };
}

import { useEffect, useRef, useState } from 'react';
import { Camera, Eye, Activity, Brain, AlertTriangle, VolumeX } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import Webcam from 'react-webcam';
import { useMonitoringStore } from '../../store/monitoringStore';
import { useTripStore } from '../../store/tripStore';
import { useDriverMonitoring } from '../../hooks/useDriverMonitoring';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import Button from '../components/Button';
import { useAuthStore } from '../../store/authStore';
import { cleanupAlertAudio, getAlertAudioStatus, initializeAlertAudio, stopAllAlertSounds } from '../../services/alertAudio';

export default function AIDriverMonitoringLive() {
  const navigate = useNavigate();
  const { fatigueLevel, blinkRate, eyeStatus, trackingPoints, isDrowsy } = useMonitoringStore();
  const { tripId, endTrip } = useTripStore();
  const emergencyContact = useAuthStore((state) => state.user?.emergencyContact);
  const webcamRef = useRef<Webcam>(null);
  const [cameraStatus, setCameraStatus] = useState('Requesting camera access...');
  const [soundStatus, setSoundStatus] = useState(getAlertAudioStatus());

  useEffect(() => {
    void initializeAlertAudio().then((ready) => {
      setSoundStatus(ready ? 'Alert Sound: Ready' : 'Alert Sound: Not Ready');
    });
  }, []);

  // Start the MediaPipe AI loop
  const { isAiReady, aiError, resetFatigue } = useDriverMonitoring(webcamRef);

  const handleDismissCriticalAlarm = () => {
    stopAllAlertSounds();
    setSoundStatus('Alert Sound: Stopped');
    resetFatigue();
  };

  const showStopButton = fatigueLevel >= 70 || isDrowsy;

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      .then((grantedStream) => {
        stream = grantedStream;
        setCameraStatus('Camera access granted');
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch(() => setCameraStatus('Camera access is required for live monitoring'));
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, []);

  const handleEndTrip = async () => {
    stopAllAlertSounds();
    cleanupAlertAudio();
    if (tripId) {
      try {
        await api.post(`/trips/${tripId}/end`);
      } catch (e) {
        console.error('Failed to end trip on server', e);
      }
    }
    // We intentionally don't clear the active tripID from the store immediately
    // so the summary screen can still fetch it. The Summary screen or navigating away can clear it.
    navigate('/trip-summary');
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">AI Monitoring</h1>
        <p className="text-muted-foreground text-sm">Live driver safety analysis via MediaPipe</p>
      </div>

      <GlassCard glow={isDrowsy ? "error" : "primary"} className="mb-6 relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isDrowsy ? 'from-error to-warning' : 'from-primary via-accent to-secondary'}`} />

        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={isDrowsy ? "warning" : "active"} label={isDrowsy ? "Drowsiness Alert" : "Monitoring Active"} />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isDrowsy ? 'bg-error' : 'bg-primary'}`} />
            <span className={`text-xs ${isDrowsy ? 'text-error' : 'text-primary'}`}>LIVE</span>
          </div>
        </div>

        <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
          {aiError ? (
            <div className="text-error">{aiError}</div>
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="absolute w-full h-full object-cover opacity-80"
            />
          )}

          {isDrowsy && (
            <div className="absolute inset-0 bg-error/20 flex items-center justify-center pointer-events-none">
              <AlertTriangle className="w-16 h-16 text-error animate-pulse" />
            </div>
          )}

          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-xs text-white">{cameraStatus}</span>
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <div className="glass-card px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md">
              <span className={`text-xs ${trackingPoints > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                {trackingPoints > 0 ? 'Face Detected' : (isAiReady ? 'Scanning...' : 'Loading AI...')}
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="glass-card p-3 rounded-lg bg-black/40 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/80">Tracking Points</span>
                <span className="text-primary font-mono">{trackingPoints} Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Eye Status</span>
            </div>
            <p className={eyeStatus.includes('Closed') || eyeStatus.includes('No Face') ? 'text-warning' : 'text-success'}>
              {eyeStatus}
            </p>
          </div>

          <div className="glass-card p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Blink Rate</span>
            </div>
            <p className="text-primary font-mono">{blinkRate}/min</p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">AI Analysis</h3>
      </div>

      <GlassCard className={`mb-3 ${isDrowsy ? 'border-error/40' : ''}`}>
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-sm font-semibold">Safety audio</p><p className="text-xs text-muted-foreground">{soundStatus}</p></div>
          <span className={`h-3 w-3 rounded-full ${isDrowsy ? 'animate-pulse bg-error' : 'bg-success'}`} />
        </div>
      </GlassCard>

      {showStopButton && (
        <Button fullWidth variant="danger" className="mb-4" onClick={handleDismissCriticalAlarm}>
          <span className="flex items-center justify-center gap-2">
            <VolumeX className="h-5 w-5" />
            {fatigueLevel >= 100 ? 'Turn Off Critical Alarm & Reset Fatigue' : 'Turn Off Alert Sound'}
          </span>
        </Button>
      )}

      <div className="space-y-3">
        <GlassCard glow={isDrowsy ? "error" : "none"}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className={`w-5 h-5 ${isDrowsy ? 'text-error' : 'text-primary'}`} />
              <span className="text-sm">Fatigue Detection</span>
            </div>
            <span className={`text-sm ${isDrowsy ? 'text-error' : 'text-success'}`}>
              {isDrowsy ? 'High' : fatigueLevel > 30 ? 'Elevated' : 'Normal'}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isDrowsy ? 'bg-error' : fatigueLevel > 30 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${Math.min(fatigueLevel, 100)}%` }} 
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{Math.round(fatigueLevel)}% fatigue level</p>
        </GlassCard>
      </div>
      
      <div className="mt-8">
        <Button fullWidth className="bg-error/20 text-error hover:bg-error/30" onClick={handleEndTrip}>
          End Driving Session
        </Button>
      </div>
    </div>
  );
}


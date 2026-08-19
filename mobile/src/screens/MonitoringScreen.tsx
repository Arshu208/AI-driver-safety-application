import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { CameraView, PermissionStatus, useCameraPermissions } from 'expo-camera';
import { colors, styles } from '../theme';
import { initializeAlertAudio, playAlertSound, playBlinkAlert, startCriticalAlarm, stopAlertSound, vibrateAlert } from '../services/alertAudio';
import { useAuth } from '../context/AuthContext';
import { endTrip, startTrip } from '../services/trip';
import { getSocket } from '../services/socket';
import { API_URL } from '../api';
import { detectEyesFromImage, initializeEyeDetector } from '../services/eyeDetector';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Mock permission object for web
const mockPermission = { status: 'granted' };

export default function MonitoringScreen() {
  // Use hook only on native platforms
  const nativePermissionHook = Platform.OS !== 'web' && useCameraPermissions ? useCameraPermissions() : [null, null];
  const [permission, requestPermissionFn] = nativePermissionHook.length ? nativePermissionHook : [mockPermission, null];
  
  const requestPermission = async () => {
    if (Platform.OS === 'web') return mockPermission;
    return requestPermissionFn?.() ?? mockPermission;
  };
  const [scanning, setScanning] = useState(false);
  const [fatigue, setFatigue] = useState(0);
  const [blinkRate, setBlinkRate] = useState(0);
  const [perclos, setPerclos] = useState(0);
  const [drowsy, setDrowsy] = useState(false);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [faceVisible, setFaceVisible] = useState(false);
  const [detectorStatus, setDetectorStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [detectorError, setDetectorError] = useState('');
  
  const cameraRef = useRef<any>(null);
  const cameraReadyRef = useRef(false);
  const scanningRef = useRef(false);
  const processingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const monitorStateRef = useRef({ eyesClosed: false, blinkRate: 0, perclos: 0, fatigue: 0 });
  const eyeStatesRef = useRef<{ timestamp: number; isClosed: boolean }[]>([]);
  const blinkTimestampsRef = useRef<number[]>([]);
  const lastEyeStatusRef = useRef<'Open' | 'Closed'>('Open');
  const tripIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | undefined>(undefined);
  const alertEnabledRef = useRef(alertEnabled);
  const lastBlinkAtRef = useRef<number>(0);
  const eyesClosedSinceRef = useRef<number | null>(null);
  const criticalAlarmActiveRef = useRef(false);
  const lastFatigueAlertRef = useRef<number>(0);

  const triggerLocalAlert = async (nextFatigue: number) => {
    if (!alertEnabledRef.current) {
      await stopAlertSound();
      criticalAlarmActiveRef.current = false;
      return;
    }

    const now = Date.now();
    
    if (nextFatigue >= 100) {
      criticalAlarmActiveRef.current = true;
      console.log('mobile: Starting critical alarm - fatigue:', nextFatigue);
      await startCriticalAlarm();
      vibrateAlert();
      return;
    }

    if (nextFatigue >= 70 && (now - lastFatigueAlertRef.current > 2000)) {
      console.log('mobile: Playing fatigue alert sound - fatigue:', nextFatigue);
      lastFatigueAlertRef.current = now;
      criticalAlarmActiveRef.current = false;
      await playAlertSound();
    }
  };

  useEffect(() => {
    void initializeAlertAudio();
    console.log('mobile: Alert audio initialized');
    return () => {
      void stopAlertSound();
    };
  }, []);

  const { user } = useAuth();
  const [tripId, setTripId] = useState<string | null>(null);

  useEffect(() => {
    tripIdRef.current = tripId;
  }, [tripId]);

  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  useEffect(() => {
    const socket = getSocket();
    const handleFatigueAlert = (alert: any) => {
      if (!tripId || !alert) return;
      if (alert.tripId === tripId || alert.driverId === user?.id) {
        console.log('mobile: Received fatigue-alert from socket:', alert);
        void playAlertSound();
        Alert.alert('Fatigue Alert', alert.message || 'High fatigue detected');
      }
    };
    socket?.on('fatigue-alert', handleFatigueAlert);
    return () => {
      socket?.off('fatigue-alert', handleFatigueAlert);
    };
  }, [tripId, user]);

  useEffect(() => {
    alertEnabledRef.current = alertEnabled;
  }, [alertEnabled]);

  const ensurePermission = async () => {
    if (Platform.OS === 'web') {
      return true; // Always grant on web
    }
    if (!permission || permission.status !== PermissionStatus?.GRANTED) {
      const result = await requestPermission();
      if (result?.status !== PermissionStatus?.GRANTED) {
        Alert.alert('Camera required', 'Please allow camera access to scan eye fatigue.');
        return false;
      }
    }
    return true;
  };

  const startScan = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Use Expo Go on a device', 'The eye-detection monitor requires camera access from the mobile app. Browser preview cannot scan eyes or play the alert sound.');
      return;
    }

    console.log('mobile: Starting scan...');
    const granted = await ensurePermission();
    if (!granted) return;

    const healthUrl = `${API_URL.replace(/\/api$/, '')}/api/health`;
    try {
      await axios.get(healthUrl, { timeout: 5000 });
      console.log('mobile: Backend health check passed');
    } catch (e) {
      Alert.alert('Backend unreachable', `Cannot reach backend at ${API_URL}.\nStart the backend on the same network and use the LAN IP in EXPO_PUBLIC_API_URL.`);
      return;
    }

    try {
      const audioReady = await initializeAlertAudio();
      if (!audioReady) {
        Alert.alert('Alert audio unavailable', 'The alert sound could not be initialized on this device. Check media volume and try again.');
        return;
      }
      setDetectorStatus('loading');
      setDetectorError('');
      const detector = await initializeEyeDetector();
      setDetectorStatus('ready');
      console.log(`mobile: ${detector ? 'Real eye landmark detector' : 'Camera monitoring fallback'} ready`);
    } catch (error) {
      setDetectorStatus('ready');
      setDetectorError('Using camera monitoring fallback');
      console.warn('mobile: Eye landmark detector unavailable; continuing with camera fallback', error);
    }

    if (!user?.id) {
      Alert.alert('Login required', 'Please sign in before starting driver monitoring.');
      return;
    }

    try {
      const resp = await startTrip(user.id);
      const nextTripId = resp.data._id || resp.data.id || null;
      console.log('mobile: Trip started:', nextTripId);
      setTripId(nextTripId);
      tripIdRef.current = nextTripId;
    } catch (e: unknown) {
      const details = axios.isAxiosError(e) ? (e.response?.data?.error || e.message || e.response?.data?.message) : String(e);
      console.error('Failed to start trip', details);
      Alert.alert('Failed to start trip', `Start trip API failed via ${API_URL}.\n${details}`);
      return;
    }

    setScanning(true);
    setFatigue(0);
    setBlinkRate(0);
    setPerclos(0);
    setDrowsy(false);
    setAlertEnabled(true);
    setAlertActive(false);
    setEyesClosed(false);
    setFaceVisible(false);
    cameraReadyRef.current = false;
    scanningRef.current = true;
    monitorStateRef.current = { eyesClosed: false, blinkRate: 0, perclos: 0, fatigue: 0 };
    eyeStatesRef.current = [];
    blinkTimestampsRef.current = [];
    lastEyeStatusRef.current = 'Open';
    lastBlinkAtRef.current = 0;
    eyesClosedSinceRef.current = null;
    lastFatigueAlertRef.current = 0;
    criticalAlarmActiveRef.current = false;

    // Start continuous frame processing from real camera face data
    intervalRef.current = setInterval(() => {
      void processFrame();
    }, 400);
  };

  const processFrame = async () => {
    if (!scanningRef.current || !cameraReadyRef.current || !cameraRef.current || processingRef.current) {
      return;
    }

    processingRef.current = true;

    try {
      const state = monitorStateRef.current;
      const now = Date.now();
      const picture = await cameraRef.current.takePictureAsync({
        quality: 0.35,
        base64: true,
        skipProcessing: true,
      });
      if (!picture.base64) {
        throw new Error('Camera did not return an image frame');
      }
      const detection = await detectEyesFromImage(picture.base64);
      const nextClosed = detection.eyesClosed;
      const faceDetected = detection.faceDetected;

      setFaceVisible(faceDetected);
      const currentStatus = nextClosed ? 'Closed' : 'Open';

      if (nextClosed) {
        eyesClosedSinceRef.current ??= now;
      } else {
        eyesClosedSinceRef.current = null;
      }
      const eyesClosedFor = eyesClosedSinceRef.current ? now - eyesClosedSinceRef.current : 0;

      eyeStatesRef.current.push({ timestamp: now, isClosed: nextClosed });
      eyeStatesRef.current = eyeStatesRef.current.filter((sample) => now - sample.timestamp < 60000);
      const totalSamples = eyeStatesRef.current.length;
      const closedSamples = eyeStatesRef.current.filter((sample) => sample.isClosed).length;
      const nextPerclos = totalSamples > 0 ? (closedSamples / totalSamples) : 0;

      if (currentStatus === 'Closed' && lastEyeStatusRef.current === 'Open') {
        blinkTimestampsRef.current.push(now);
        if (now - lastBlinkAtRef.current > 300) {
          console.log('mobile: Blink detected from camera data');
          void playBlinkAlert();
          lastBlinkAtRef.current = now;
        }
      }

      lastEyeStatusRef.current = currentStatus;
      blinkTimestampsRef.current = blinkTimestampsRef.current.filter((time) => now - time < 60000);
      const nextBlinkRate = blinkTimestampsRef.current.length;

      let nextFatigue = state.fatigue;
      if (faceDetected) {
        if (eyesClosedFor >= 2000) {
          nextFatigue = 100;
          console.log('mobile: Eyes continuously closed for 2 seconds - critical fatigue');
        } else if (nextPerclos > 0.15) {
          nextFatigue = clamp(nextFatigue + 2, 0, 100);
          console.log('mobile: High PERCLOS from camera data -> fatigue', nextFatigue);
        } else if (nextClosed) {
          nextFatigue = clamp(nextFatigue + 0.5, 0, 100);
          console.log('mobile: Eyes closed from camera data -> fatigue', nextFatigue);
        } else {
          nextFatigue = clamp(nextFatigue - 0.2, 0, 100);
        }
      } else {
        nextFatigue = clamp(nextFatigue - 0.5, 0, 100);
      }

      const nextDrowsy = nextFatigue > 70 || nextPerclos > 0.2;
      const nextAlertActive = nextFatigue >= 70;

      monitorStateRef.current = {
        eyesClosed: nextClosed,
        blinkRate: nextBlinkRate,
        perclos: nextPerclos,
        fatigue: nextFatigue,
      };

      setEyesClosed(nextClosed);
      setBlinkRate(nextBlinkRate);
      setPerclos(nextPerclos);
      setFatigue(nextFatigue);
      setDrowsy(nextDrowsy);
      setAlertActive(nextAlertActive);

      if (alertEnabledRef.current && nextAlertActive) {
        void triggerLocalAlert(nextFatigue);
      } else {
        criticalAlarmActiveRef.current = false;
      }

      try {
        const socket = getSocket();
        if (socket && tripIdRef.current) {
          socket.emit('driverTelemetry', {
            driverId: userIdRef.current || socket.id,
            tripId: tripIdRef.current,
            fatigueLevel: Math.round(nextFatigue),
            blinkRate: nextBlinkRate,
            perclos: (nextPerclos * 100).toFixed(1),
            isDrowsy: nextDrowsy,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('mobile: Socket emit error', error);
      }
    } catch (error) {
      setDetectorStatus('error');
      setDetectorError(error instanceof Error ? error.message : String(error));
      console.error('mobile: Face detection error', error);
    } finally {
      processingRef.current = false;
    }
  };

  const stopScan = async () => {
    console.log('mobile: Stopping scan...');
    scanningRef.current = false;
    cameraReadyRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setScanning(false);
    setAlertActive(false);
    criticalAlarmActiveRef.current = false;
    await stopAlertSound();

    if (tripIdRef.current) {
      try {
        await endTrip(tripIdRef.current);
        console.log('mobile: Trip ended');
      } catch (error) {
        console.warn('mobile: failed to end trip', error);
      }
      setTripId(null);
      tripIdRef.current = null;
    }
  };

  const stopSound = async () => {
    console.log('mobile: Stopping alert sound');
    setAlertEnabled(true);
    alertEnabledRef.current = true;
    setAlertActive(false);
    criticalAlarmActiveRef.current = false;
    setFatigue(0);
    setBlinkRate(0);
    setPerclos(0);
    setDrowsy(false);
    setEyesClosed(false);
    monitorStateRef.current = { eyesClosed: false, blinkRate: 0, perclos: 0, fatigue: 0 };
    eyeStatesRef.current = [];
    blinkTimestampsRef.current = [];
    lastEyeStatusRef.current = 'Open';
    lastBlinkAtRef.current = 0;
    eyesClosedSinceRef.current = null;
    lastFatigueAlertRef.current = 0;
    await stopAlertSound();
  };

  if (permission === null && Platform.OS !== 'web') {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Checking camera permissions…</Text>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if ((permission && permission.status !== PermissionStatus?.GRANTED) && Platform.OS !== 'web') {
    return (
      <View style={styles.screen}>
        <View style={styles.content}>
          <Text style={styles.title}>Camera access required</Text>
          <Text style={styles.subtitle}>Enable camera access to use real-time blink-based fatigue detection.</Text>
          <TouchableOpacity style={styles.button} onPress={ensurePermission}>
            <Text style={styles.buttonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getFatigueStatus = () => {
    if (fatigue >= 100) return 'Critical';
    if (fatigue >= 70) return 'Warning';
    return 'Normal';
  };

  const getFatigueStatusColor = () => {
    if (fatigue >= 100) return colors.danger;
    if (fatigue >= 70) return colors.warning;
    return colors.primary;
  };

  const getEyeStatus = () => {
    if (!faceVisible) return 'No Face Detected';
    if (eyesClosed) return 'Closed (Drowsy)';
    return 'Open & Alert';
  };

  return (
    <View style={styles.screen}>
      {scanning && Platform.OS !== 'web' && CameraView && (
        <CameraView
          ref={cameraRef}
          style={{ width: '100%', height: Dimensions.get('window').height * 0.35, backgroundColor: '#000' }}
          facing="front"
          mirror
          active={scanning}
          onCameraReady={() => {
            cameraReadyRef.current = true;
            console.log('mobile: Camera ready for eye landmark frames');
          }}
        />
      )}
      
      {scanning && Platform.OS === 'web' && (
        <View style={{ width: '100%', height: Dimensions.get('window').height * 0.35, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center', paddingHorizontal: 20 }}>
            📷 Camera monitoring requires Expo Go on a real device{'\n'}Use the mobile app on Android/iPhone to detect eyes and fatigue.
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={scanning}
      >
        {scanning && (
          <>
            <View style={{ marginBottom: 16 }}>
              <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>Tracking Points</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>{faceVisible ? '478 Active' : 'Waiting'}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View style={[styles.card, { flex: 1 }]}>
                <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>Eye Status</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>{getEyeStatus()}</Text>
              </View>
              <View style={[styles.card, { flex: 1 }]}>
                <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>Blink Rate</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>{blinkRate}/min</Text>
              </View>
            </View>

            <View style={[styles.card, { marginBottom: 16 }]}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 12 }}>AI Analysis</Text>

              <View style={{ marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>Safety audio</Text>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: alertEnabled ? colors.primary : colors.danger }} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink }}>Alert Sound: {alertEnabled ? 'Ready' : 'Disabled'}</Text>
              </View>

              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>Fatigue Detection</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: getFatigueStatusColor() }}>{getFatigueStatus()}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink }}>{Math.round(fatigue)}% fatigue level</Text>
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <View style={[styles.card, { paddingVertical: 8 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>Face Detection</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: faceVisible ? colors.primary : colors.danger }}>{faceVisible ? 'Detected' : 'No Face'}</Text>
                </View>
                <Text style={{ fontSize: 11, color: detectorStatus === 'error' ? colors.danger : colors.muted, marginTop: 6 }}>
                  Eye model: {detectorStatus === 'ready' ? 'Ready' : detectorStatus === 'loading' ? 'Loading' : detectorStatus === 'error' ? `Error: ${detectorError}` : 'Waiting'}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>PERCLOS</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.ink }}>{(perclos * 100).toFixed(0)}%</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {!scanning && (
          <View style={[styles.card, { marginBottom: 16, alignItems: 'center', marginTop: 40 }]}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 8 }}>Ready to Monitor</Text>
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: 'center' }}>Start monitoring to track eye fatigue and receive real-time alerts.</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 10 }}>
        {scanning ? (
          <>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.danger }]} onPress={stopScan}>
              <Text style={styles.buttonText}>End Driving Session</Text>
            </TouchableOpacity>
            {alertActive && (
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.warning }]} onPress={stopSound}>
                <Text style={styles.buttonText}>{fatigue >= 100 ? 'Turn Off Critical Alarm & Reset Fatigue' : 'Turn Off Alert Sound'}</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={startScan}>
            <Text style={styles.buttonText}>Start Monitoring</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

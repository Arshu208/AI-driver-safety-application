import { Platform, Vibration } from 'react-native';
import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;
let isLoaded = false;
let criticalLooping = false;
let criticalLoopIntervalRef: NodeJS.Timeout | null = null;
let webAudioContext: AudioContext | null = null;
let webOscillator: OscillatorNode | null = null;

// Try multiple alarm sound sources
const ALERT_URLS = [
  'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
  'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_d5d5b5b4dd.mp3', // Alarm beep
];

const FALLBACK_ALARM_URI = 'data:audio/wav;base64,UklGRmQBAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUABAAAAAMc2alROS6IfcuVxt76qLMWb+oMyPFPCTZckoep6ujyqW8E79Qwuu1HnT2Yp5u/JvRCqyb3m72Yp50+7UQwuO/VbwTyqerqh6pckwk08U4Mym/osxb6qcbdy5aIfTktqVMc2AAA5yZarsrRe4I4aj0hCVdQ6ZQV9zcSsPrJp218VhkXEVaU+xQr00UWuGbCa1hoQN0LwVTdCGhCa1hmwRa700cUKpT7EVYZFXxVp2z6yxKx9zWUF1DpCVY9Ijhpe4LK0lqs5yQAAxzZqVE5Loh9y5XG3vqosxZv6gzI8U8JNlySh6nq6PKpbwTv1DC67UedPZinm78m9EKrJvebvZinnT7tRDC479VvBPKp6uqHqlyTCTTxTgzKb+izFvqpxt3Lloh9OS2pUxzYAADnJlquytF7gjhqPSEJV1DplBQ==';

// Web Audio API fallback for browser
function playWebBeep(frequency: number = 800, duration: number = 200) {
  try {
    if (!webAudioContext) {
      webAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = webAudioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
    
    webOscillator = osc;
    console.log('mobile: Web beep played at', frequency, 'Hz');
    return true;
  } catch (error) {
    console.warn('mobile: Web Audio API failed:', error);
    return false;
  }
}

export async function initializeAlertAudio() {
  if (isLoaded && sound) {
    console.log('mobile: Alert audio already initialized');
    return true;
  }

  // On web, audio is initialized lazily
  if (Platform.OS === 'web') {
    console.log('mobile: Web platform detected, using Web Audio API');
    isLoaded = true;
    return true;
  }

  try {
    console.log('mobile: Initializing alert audio...');
    
    // Set audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });
    console.log('mobile: Audio mode set successfully');

    // Try to load sound from first available URL
    for (const url of ALERT_URLS) {
      try {
        console.log('mobile: Attempting to load sound from:', url);
        const { sound: loadedSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false, volume: 1.0 },
          onPlaybackStatusUpdate,
        );
        sound = loadedSound;
        isLoaded = true;
        console.log('mobile: Alert audio loaded successfully from:', url);
        return true;
      } catch (err) {
        console.warn('mobile: Failed to load from', url, ':', err);
      }
    }

    console.warn('mobile: Remote alert audio unavailable, loading embedded fallback alarm');
    const { sound: fallbackSound } = await Audio.Sound.createAsync(
      { uri: FALLBACK_ALARM_URI },
      { shouldPlay: false, volume: 1.0 },
      onPlaybackStatusUpdate,
    );
    sound = fallbackSound;
    isLoaded = true;
    return true;
  } catch (error) {
    console.error('mobile: Failed to initialize alert audio', error);
    isLoaded = false;
    return false;
  }
}

const onPlaybackStatusUpdate = (status: any) => {
  if (!status.isLoaded) {
    if (status.error) {
      console.error('mobile: Audio playback error:', status.error);
    }
  } else {
    console.log('mobile: Playback status - isPlaying:', status.isPlaying, 'position:', status.positionMillis);
  }
};

function startCriticalAlarmLoop() {
  if (criticalLoopIntervalRef) {
    clearInterval(criticalLoopIntervalRef);
  }
  
  console.log('mobile: Starting software critical alarm loop (every 1.5s)');
  criticalLoopIntervalRef = setInterval(() => {
    if (!criticalLooping) {
      if (criticalLoopIntervalRef) {
        clearInterval(criticalLoopIntervalRef);
        criticalLoopIntervalRef = null;
      }
      return;
    }
    
    if (sound) {
      sound.playAsync().catch(err => console.warn('mobile: Software loop play failed:', err));
    }
    vibrateAlert();
  }, 1500); // Play sound every 1.5 seconds
}

export async function playAlertSound() {
  console.log('mobile: playAlertSound called');
  
  if (Platform.OS === 'web') {
    playWebBeep(800, 200);
    return;
  }
  
  if (!sound) {
    console.log('mobile: Sound not loaded, initializing...');
    const ready = await initializeAlertAudio();
    if (!ready || !sound) {
      console.error('mobile: Failed to initialize audio');
      vibrateAlert();
      return;
    }
  }

  try {
    console.log('mobile: Playing alert sound...');
    const status = await sound!.getStatusAsync();
    console.log('mobile: Sound status before play:', (status as any).isLoaded, (status as any).isPlaying);
    
    if ((status as any).isLoaded) {
      await sound!.replayAsync();
      console.log('mobile: Alert sound played successfully');
    }
  } catch (error) {
    console.error('mobile: Failed to play alert sound', error);
    playWebBeep(800, 200); // Fallback to web beep
    vibrateAlert();
  }
}

export async function playBlinkAlert() {
  console.log('mobile: playBlinkAlert called');
  await playAlertSound();
}

export async function startCriticalAlarm() {
  console.log('mobile: startCriticalAlarm called');
  
  if (Platform.OS === 'web') {
    // On web, play continuous beeps
    if (criticalLooping) {
      console.log('mobile: Critical alarm already looping on web');
      return;
    }
    
    criticalLooping = true;
    playWebBeep(1000, 300); // Louder/longer beep for critical
    
    if (criticalLoopIntervalRef) {
      clearInterval(criticalLoopIntervalRef);
    }
    
    criticalLoopIntervalRef = setInterval(() => {
      if (criticalLooping) {
        playWebBeep(1000, 300);
      }
    }, 1500);
    
    return;
  }
  
  if (!sound) {
    const ready = await initializeAlertAudio();
    if (!ready || !sound) {
      console.error('mobile: Failed to initialize audio for critical alarm, using vibration-only mode');
      criticalLooping = true;
      startCriticalAlarmLoop();
      vibrateAlert();
      return;
    }
  }

  if (criticalLooping) {
    console.log('mobile: Critical alarm already looping');
    return;
  }

  try {
    console.log('mobile: Starting critical alarm loop...');
    criticalLooping = true;
    
    // Try native looping first
    try {
      await sound!.setIsLoopingAsync(true);
      await sound!.playAsync();
      console.log('mobile: Critical alarm started with native looping');
    } catch (nativeError) {
      console.warn('mobile: Native looping failed, using software loop:', nativeError);
      await sound!.playAsync();
      startCriticalAlarmLoop();
    }
  } catch (error) {
    console.error('mobile: Failed to start critical alarm', error);
    startCriticalAlarmLoop();
    vibrateAlert();
  }
}

export async function stopAlertSound() {
  try {
    // Stop software loop first
    if (criticalLoopIntervalRef) {
      clearInterval(criticalLoopIntervalRef);
      criticalLoopIntervalRef = null;
    }
    
    criticalLooping = false;
    
    // Stop web oscillator if running
    if (Platform.OS === 'web' && webOscillator) {
      try {
        webOscillator.stop();
        webOscillator = null;
      } catch {}
    }
    
    if (sound) {
      try {
        await sound.setIsLoopingAsync(false);
      } catch {}
      
      const status = await sound.getStatusAsync();
      if ((status as any).isLoaded && (status as any).isPlaying) {
        console.log('mobile: Stopping alert sound');
        await sound.stopAsync();
      }
    }
  } catch (error) {
    console.error('mobile: Error stopping alert sound', error);
  }
}

export function vibrateAlert() {
  if (Platform.OS === 'web') {
    // Use browser's Vibration API if available
    if ('vibrate' in navigator) {
      (navigator as any).vibrate?.([0, 400, 250, 400]);
    }
    return;
  }
  
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    console.log('mobile: Vibrating alert');
    Vibration.vibrate([0, 400, 250, 400], false);
  }
}

export async function cleanupAlertAudio() {
  try {
    console.log('mobile: Cleaning up alert audio');
    if (criticalLoopIntervalRef) {
      clearInterval(criticalLoopIntervalRef);
      criticalLoopIntervalRef = null;
    }
    if (sound) {
      await sound.unloadAsync();
    }
  } catch (error) {
    console.error('mobile: Error cleaning up audio', error);
  }
  sound = null;
  isLoaded = false;
  criticalLooping = false;
}

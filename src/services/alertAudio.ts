let audioContext: AudioContext | null = null;
let criticalOscillator: OscillatorNode | null = null;
let criticalGain: GainNode | null = null;
const beepOscillators = new Set<OscillatorNode>();
let nextBeepTime = 0;
let audioReady = false;

export function getAlertAudioStatus() {
  return audioReady ? 'Alert Sound: Ready' : 'Alert Sound: Not Ready';
}

export async function initializeAlertAudio() {
  try {
    if (!audioContext) {
      const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtor) {
        console.warn('Browser does not support AudioContext');
        audioReady = false;
        return false;
      }
      audioContext = new AudioCtor();
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    audioReady = audioContext.state === 'running';
    return audioReady;
  } catch (error) {
    console.error('Alert audio initialization failed', error);
    audioReady = false;
    return false;
  }
}

export function playBlinkAlert() {
  if (!audioContext) {
    void initializeAlertAudio();
    return;
  }

  if (!audioReady && audioContext.state !== 'running') {
    void initializeAlertAudio();
    return;
  }

  const now = audioContext.currentTime;
  const startTime = Math.max(now, nextBeepTime);
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.16);
  oscillator.connect(gain).connect(audioContext.destination);
  beepOscillators.add(oscillator);
  oscillator.addEventListener('ended', () => beepOscillators.delete(oscillator), { once: true });
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.18);
  nextBeepTime = startTime + 0.18;
}

export function startCriticalAlarm() {
  if (!audioContext) {
    void initializeAlertAudio();
    return;
  }

  if (!audioReady && audioContext.state !== 'running') {
    void initializeAlertAudio();
    return;
  }

  if (criticalOscillator) return;

  criticalOscillator = audioContext.createOscillator();
  criticalGain = audioContext.createGain();
  criticalOscillator.type = 'square';
  criticalOscillator.frequency.setValueAtTime(740, audioContext.currentTime);
  criticalGain.gain.setValueAtTime(0.28, audioContext.currentTime);
  criticalOscillator.connect(criticalGain).connect(audioContext.destination);
  criticalOscillator.start();
}

export function stopCriticalAlarm() {
  if (!criticalOscillator) return;
  try {
    criticalOscillator.stop();
  } catch {
    // The oscillator may already have stopped during cleanup.
  }
  criticalOscillator.disconnect();
  criticalGain?.disconnect();
  criticalOscillator = null;
  criticalGain = null;
}

export function stopAllAlertSounds() {
  stopCriticalAlarm();
  for (const oscillator of beepOscillators) {
    try {
      oscillator.stop();
    } catch {
      // The beep may already have ended.
    }
    oscillator.disconnect();
  }
  beepOscillators.clear();
  nextBeepTime = 0;
}

export function cleanupAlertAudio() {
  stopAllAlertSounds();
  if (audioContext) {
    void audioContext.close();
    audioContext = null;
  }
  audioReady = false;
}

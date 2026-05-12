import { create } from 'zustand';

interface MonitoringState {
  isMonitoring: boolean;
  fatigueLevel: number;
  blinkRate: number;
  isDrowsy: boolean;
  eyeStatus: string;
  trackingPoints: number;
  
  setIsMonitoring: (status: boolean) => void;
  setMonitoringData: (
    fatigue: number,
    blink: number,
    drowsy: boolean,
    status: string,
    points: number
  ) => void;
  resetMonitoring: () => void;
}

export const useMonitoringStore = create<MonitoringState>((set) => ({
  isMonitoring: false,
  fatigueLevel: 0,
  blinkRate: 0,
  isDrowsy: false,
  eyeStatus: 'Initializing AI...',
  trackingPoints: 0,

  setIsMonitoring: (status) => set({ isMonitoring: status }),
  
  setMonitoringData: (fatigue, blink, drowsy, status, points) =>
    set({
      fatigueLevel: fatigue,
      blinkRate: blink,
      isDrowsy: drowsy,
      eyeStatus: status,
      trackingPoints: points
    }),
    
  resetMonitoring: () => set({
    fatigueLevel: 0,
    blinkRate: 0,
    isDrowsy: false,
    eyeStatus: 'Standby',
    trackingPoints: 0
  })
}));

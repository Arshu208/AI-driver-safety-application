import TelemetryEvent from '../models/TelemetryEvent';
import SafetyEvent from '../models/SafetyEvent';

export const EventRecorder = {
  async recordTelemetry(tripId: string, fatigue: number, blinkRate: number, perclos: number, isDrowsy: boolean) {
    try {
      await TelemetryEvent.create({
        tripId,
        fatigueLevel: fatigue,
        blinkRate,
        perclos,
        isDrowsy
      });
    } catch (e) {
      console.error('Failed to record telemetry', e);
    }
  },

  async recordSafetyEvent(tripId: string, severity: string, eventType: string, fatigue: number, perclos: number) {
    try {
      await SafetyEvent.create({
        tripId,
        severity,
        eventType,
        fatigue,
        perclos
      });
    } catch (e) {
      console.error('Failed to record safety event', e);
    }
  }
};

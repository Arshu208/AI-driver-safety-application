import { EventRecorder } from './eventRecorder';

export const RiskEngine = {
  processTelemetry: async (tripId: string, data: any) => {
    // Parse perclos properly from frontend
    const perclos = parseFloat(data.perclos);

    // Evaluate Critical Safety Events
    if (data.isDrowsy || perclos > 20 || data.fatigueLevel > 70) {
      const severity = perclos > 30 ? 'CRITICAL' : 'HIGH';
      const eventType = perclos > 20 ? 'DROWSINESS_PERCLOS_SPIKE' : 'DROWSINESS_ALERT';
      
      await EventRecorder.recordSafetyEvent(
        tripId,
        severity,
        eventType,
        data.fatigueLevel,
        perclos
      );
      
      return { triggerAlert: true, severity, eventType };
    }
    
    return { triggerAlert: false };
  }
};

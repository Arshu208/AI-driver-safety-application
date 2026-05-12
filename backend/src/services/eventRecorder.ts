import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const EventRecorder = {
  async recordTelemetry(tripId: string, fatigue: number, blinkRate: number, perclos: number, isDrowsy: boolean) {
    try {
      await prisma.telemetryEvent.create({
        data: {
          tripId,
          fatigueLevel: fatigue,
          blinkRate,
          perclos,
          isDrowsy
        }
      });
    } catch (e) {
      console.error('Failed to record telemetry', e);
    }
  },

  async recordSafetyEvent(tripId: string, severity: string, eventType: string, fatigue: number, perclos: number) {
    try {
      await prisma.safetyEvent.create({
        data: {
          tripId,
          severity,
          eventType,
          fatigue,
          perclos
        }
      });
    } catch (e) {
      console.error('Failed to record safety event', e);
    }
  }
};

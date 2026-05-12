import { Request, Response } from 'express';
import { prisma } from '../services/eventRecorder';
import { calculateSafetyScore } from '../services/safetyScore';

export const getTripSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;

    const telemetry = await prisma.telemetryEvent.findMany({ 
      where: { tripId },
      orderBy: { createdAt: 'asc' }
    });
    const safetyEvents = await prisma.safetyEvent.findMany({ 
      where: { tripId },
      orderBy: { createdAt: 'asc' }
    });

    if (telemetry.length === 0) {
      res.status(404).json({ error: 'Trip not found or no telemetry data.' });
      return;
    }

    const totalAlerts = safetyEvents.length;
    const criticalAlerts = safetyEvents.filter(e => e.severity === 'CRITICAL').length;
    const highAlerts = safetyEvents.filter(e => e.severity === 'HIGH').length;

    const maxFatigue = Math.max(...telemetry.map(t => t.fatigueLevel));
    const avgFatigue = telemetry.reduce((acc, t) => acc + t.fatigueLevel, 0) / telemetry.length;
    const avgPerclos = telemetry.reduce((acc, t) => acc + t.perclos, 0) / telemetry.length;

    const startedAt = telemetry[0].createdAt;
    const endedAt = telemetry[telemetry.length - 1].createdAt;
    const durationMs = endedAt.getTime() - startedAt.getTime();

    const safetyScore = calculateSafetyScore({
      criticalAlerts,
      highAlerts,
      avgPerclos,
      maxFatigue
    });

    // Optionally update trip record with final score
    await prisma.trip.update({
      where: { id: tripId },
      data: { safetyScore, endedAt: new Date() }
    }).catch(() => null); // ignore if trip record doesn't exist yet for demo

    res.json({
      tripId,
      startedAt,
      endedAt,
      durationMinutes: Math.max(1, Math.round(durationMs / 60000)),
      metrics: {
        averageFatigue: Math.round(avgFatigue),
        maxFatigue: Math.round(maxFatigue),
        averagePerclos: Number(avgPerclos.toFixed(2)),
        totalAlerts,
        criticalAlerts,
        safetyScore
      },
      telemetry: telemetry.map(t => ({
        time: t.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
        fatigue: t.fatigueLevel,
        perclos: t.perclos
      })),
      safetyEvents
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate trip summary' });
  }
};

export const startTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    let user = await prisma.user.findFirst({ where: { id: userId || 'demo-user-id' } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId || 'demo-user-id',
          email: `demo-${Date.now()}@driver.com`,
          password: 'mock',
          role: 'DRIVER'
        }
      });
    }

    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
      }
    });

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start trip' });
  }
};

export const endTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    await prisma.trip.update({
      where: { id: tripId },
      data: { endedAt: new Date() }
    });
    res.json({ message: 'Trip ended successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to end trip' });
  }
};

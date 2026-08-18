import { Request, Response } from 'express';
import { calculateSafetyScore } from '../services/safetyScore';
import mongoose from 'mongoose';
import Driver from '../models/Driver';
import Trip from '../models/Trip';
import TelemetryEvent from '../models/TelemetryEvent';
import SafetyEvent from '../models/SafetyEvent';

export const getTripSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;

    if (!mongoose.isValidObjectId(tripId)) {
      res.status(400).json({ error: 'Invalid trip ID' });
      return;
    }

    const telemetry = await TelemetryEvent.find({ tripId }).sort({ createdAt: 1 }).lean();
    const safetyEvents = await SafetyEvent.find({ tripId }).sort({ createdAt: 1 }).lean();

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
    await Trip.findByIdAndUpdate(tripId, { safetyScore, endedAt: new Date() });

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
    let user = userId && mongoose.isValidObjectId(userId) ? await Driver.findById(userId) : null;
    
    if (!user) {
      user = await Driver.create({
        name: 'Demo Driver',
        phone: `demo-${Date.now()}`,
        email: `demo-${Date.now()}@driver.com`,
        password: 'mock',
        safetyScore: 100
      });
    }

    const trip = await Trip.create({ userId: user._id });

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start trip' });
  }
};

export const endTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    if (!mongoose.isValidObjectId(tripId)) {
      res.status(400).json({ error: 'Invalid trip ID' });
      return;
    }
    await Trip.findByIdAndUpdate(tripId, { endedAt: new Date() });
    res.json({ message: 'Trip ended successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to end trip' });
  }
};

export const getTripHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string' || !mongoose.isValidObjectId(userId)) {
      res.status(400).json({ error: 'userId query parameter is required' });
      return;
    }

    const trips = await Trip.find({ userId }).sort({ startedAt: -1 }).lean();
    const history = await Promise.all(trips.map(async (trip) => {
      const telemetry = await TelemetryEvent.find({ tripId: trip._id }).sort({ createdAt: 1 }).lean();
      const safetyEvents = await SafetyEvent.find({ tripId: trip._id }).lean();
      const maxFatigue = telemetry.length ? Math.max(...telemetry.map((t) => t.fatigueLevel)) : 0;
      return {
        id: trip._id.toString(),
        startedAt: trip.startedAt,
        endedAt: trip.endedAt,
        safetyScore: trip.safetyScore,
        fatigueLevel: maxFatigue,
        criticalAlerts: safetyEvents.filter((e) => e.severity === 'CRITICAL').length,
        highAlerts: safetyEvents.filter((e) => e.severity === 'HIGH').length,
      };
    }));

    res.json({ trips: history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load trip history' });
  }
};

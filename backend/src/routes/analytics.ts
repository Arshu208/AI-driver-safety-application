import { Router, Request, Response } from 'express';
import { prisma } from '../services/eventRecorder';

const router = Router();

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const activeTrips = await prisma.trip.count({ where: { endedAt: null } });
    const totalEvents = await prisma.safetyEvent.count();
    
    res.json({
      activeDrivers: activeTrips || 1,
      criticalAlertsToday: totalEvents,
      avgFleetSafetyScore: 92,
      fleetTrend: 'improving'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;

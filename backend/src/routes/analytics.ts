import { Router, Request, Response } from 'express';
import Trip from '../models/Trip';
import SafetyEvent from '../models/SafetyEvent';

const router = Router();

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const activeTrips = await Trip.countDocuments({ endedAt: null });
    const totalEvents = await SafetyEvent.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    res.json({
      activeDrivers: activeTrips,
      criticalAlertsToday: totalEvents,
      avgFleetSafetyScore: 92,
      fleetTrend: 'improving'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;

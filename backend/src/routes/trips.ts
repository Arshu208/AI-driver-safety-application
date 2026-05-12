import { Router } from 'express';
import { getTripSummary, startTrip, endTrip } from '../controllers/tripController';

const router = Router();

router.post('/start', startTrip);
router.post('/:tripId/end', endTrip);
router.get('/:tripId/summary', getTripSummary);

export default router;

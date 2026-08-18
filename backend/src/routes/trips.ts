import { Router } from 'express';
import { getTripSummary, startTrip, endTrip, getTripHistory } from '../controllers/tripController';

const router = Router();

router.post('/start', startTrip);
router.post('/:tripId/end', endTrip);
router.get('/', getTripHistory);
router.get('/:tripId/summary', getTripSummary);

export default router;

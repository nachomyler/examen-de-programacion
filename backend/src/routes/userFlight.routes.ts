import { Router } from 'express';
import {
  takeFlight,
  releaseFlight,
  getMyFlights,
  checkFlightTaken
} from '../controllers/userFlight.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/flight/:flightId/take', authenticate, takeFlight);
router.delete('/flight/:flightId/release', authenticate, releaseFlight);
router.get('/my-flights', authenticate, getMyFlights);
router.get('/flight/:flightId/check', authenticate, checkFlightTaken);

export default router;



import { Router } from 'express';
import {
  getActiveFlights,
  getNextFlight,
  getDashboard,
  updateFlightStatus
} from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/active', authenticate, getActiveFlights);
router.get('/next', authenticate, getNextFlight);
router.get('/', authenticate, getDashboard); // Nuevo endpoint completo
router.put('/flight/:id/status', authenticate, updateFlightStatus);

export default router;








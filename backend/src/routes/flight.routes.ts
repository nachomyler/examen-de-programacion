import { Router } from 'express';
import {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight
} from '../controllers/flight.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../types';

const router = Router();

router.get('/', authenticate, getAllFlights);
router.get('/:id', authenticate, getFlightById);
router.post('/', authenticate, requireRole(UserRole.OPERADOR, UserRole.ADMIN), createFlight);
router.put('/:id', authenticate, requireRole(UserRole.OPERADOR, UserRole.ADMIN), updateFlight);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN), deleteFlight);

export default router;



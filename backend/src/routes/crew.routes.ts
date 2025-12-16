import { Router } from 'express';
import {
  getCrewByFlight,
  addCrewMember,
  removeCrewMember
} from '../controllers/crew.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../types';

const router = Router();

router.get('/flight/:flightId', authenticate, getCrewByFlight);
router.post('/flight/:flightId', authenticate, requireRole(UserRole.OPERADOR, UserRole.ADMIN), addCrewMember);
router.delete('/:id', authenticate, requireRole(UserRole.OPERADOR, UserRole.ADMIN), removeCrewMember);

export default router;



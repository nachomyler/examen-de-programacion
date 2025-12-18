import { Router } from 'express';
import {
  getAllPlanes,
  getPlaneById,
  createPlane,
  updatePlane
} from '../controllers/plane.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllPlanes);
router.get('/:id', authenticate, getPlaneById);
router.post('/', authenticate, createPlane);
router.put('/:id', authenticate, updatePlane);

export default router;








import express, { Request, Response } from 'express'
import Plane from '../models/Plane'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware'

const router = express.Router()

// Get all planes
router.get('/', async (req: Request, res: Response) => {
  try {
    const planes = await Plane.find().sort({ code: 'asc' })
    res.json(planes.map(p => p.toJSON()))
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Get plane by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const plane = await Plane.findById(req.params.id)
    if (!plane) {
      return res.status(404).json({ error: 'Plane not found' })
    }
    res.json(plane.toJSON())
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Create plane (requires authentication - Operator or Admin)
router.post('/', authenticate, requireRole('OPERADOR', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { code, model, capacity, status } = req.body

    if (!code || !model || !capacity) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if code already exists
    const existingPlane = await Plane.findOne({ code: code.toUpperCase() })
    if (existingPlane) {
      return res.status(400).json({ error: 'Plane code already exists' })
    }

    const plane = await Plane.create({
      code: code.toUpperCase(),
      modelName: model,
      capacity: parseInt(capacity),
      status: status || 'DISPONIBLE'
    })

    res.status(201).json(plane.toJSON())
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Plane code already exists' })
    }
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Update plane (requires authentication - Operator or Admin)
router.put('/:id', authenticate, requireRole('OPERADOR', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const plane = await Plane.findById(req.params.id)
    if (!plane) {
      return res.status(404).json({ error: 'Plane not found' })
    }

    const { code, model, capacity, status } = req.body

    if (code && code.toUpperCase() !== plane.code) {
      const codeExists = await Plane.findOne({ code: code.toUpperCase() })
      if (codeExists) {
        return res.status(400).json({ error: 'Plane code already exists' })
      }
      plane.code = code.toUpperCase()
    }
    if (model) plane.modelName = model
    if (capacity) plane.capacity = parseInt(capacity)
    if (status) plane.status = status

    await plane.save()
    res.json(plane.toJSON())
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export default router


import express, { Request, Response } from 'express'
import CrewMember from '../models/CrewMember'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware'
import axios from 'axios'

const router = express.Router()

const FLIGHTS_SERVICE = process.env.FLIGHTS_SERVICE_URL || 'http://localhost:3002'

// Get crew by flight
router.get('/flight/:flightId', async (req: Request, res: Response) => {
  try {
    // Verify flight exists
    try {
      await axios.get(`${FLIGHTS_SERVICE}/${req.params.flightId}`)
    } catch (error: any) {
      if (error.response?.status === 404) {
        return res.status(404).json({ error: 'Flight not found' })
      }
    }

    const crewMembers = await CrewMember.find({ flightId: req.params.flightId }).sort({ role: 'asc' })
    res.json(crewMembers.map(member => member.toJSON()))
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Add crew member to flight (Operator or Admin only)
router.post('/flight/:flightId', authenticate, requireRole('OPERADOR', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { flightId } = req.params
    const { name, role } = req.body

    if (!name || !role) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify flight exists and is not deleted
    try {
      const flightResponse = await axios.get(`${FLIGHTS_SERVICE}/${flightId}`)
      if (flightResponse.data.deletedAt) {
        return res.status(404).json({ error: 'Flight not found' })
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return res.status(404).json({ error: 'Flight not found' })
      }
    }

    const crewMember = await CrewMember.create({
      name,
      role,
      flightId
    })

    res.status(201).json(crewMember.toJSON())
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Remove crew member (Operator or Admin only)
router.delete('/:id', authenticate, requireRole('OPERADOR', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const crewMember = await CrewMember.findById(req.params.id)
    if (!crewMember) {
      return res.status(404).json({ error: 'Crew member not found' })
    }

    await CrewMember.findByIdAndDelete(req.params.id)
    res.json({ message: 'Crew member removed successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export default router









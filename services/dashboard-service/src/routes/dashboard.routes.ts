import express, { Request, Response } from 'express'
import Flight from '../models/Flight'
import axios from 'axios'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware'

const router = express.Router()

const PLANES_SERVICE = process.env.PLANES_SERVICE_URL || 'http://localhost:3003'

// Get active flights (requires authentication)
router.get('/active', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const flights = await Flight.find({
      status: { $in: ['EMBARCANDO', 'EN_VUELO'] },
      deletedAt: null
    })
      .sort({ date: 'asc', time: 'asc' })

    // Enrich with plane data
    const enrichedFlights = await Promise.all(
      flights.map(async (flight: any) => {
        const flightObj: any = flight.toJSON()
        try {
          const planeResponse = await axios.get(`${PLANES_SERVICE}/planes/${flightObj.planeId}`)
          flightObj.plane = planeResponse.data
        } catch (error) {
          // Plane not found
        }
        return flightObj
      })
    )

    res.json(enrichedFlights)
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Get next flight (requires authentication)
router.get('/next', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    const nextFlight = await Flight.findOne({
      status: 'PROGRAMADO',
      deletedAt: null,
      date: { $gte: today }
    })
      .sort({ date: 'asc', time: 'asc' })

    if (!nextFlight) {
      return res.json(null)
    }

    const flightObj: any = nextFlight.toJSON()

    // Enrich with plane data
    try {
      const planeResponse = await axios.get(`${PLANES_SERVICE}/planes/${flightObj.planeId}`)
      flightObj.plane = planeResponse.data
    } catch (error) {
      // Plane not found
    }

    res.json(flightObj)
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Update flight status (requires authentication - Operator or Admin)
router.put('/flight/:id/status', authenticate, requireRole('OPERADOR', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['PROGRAMADO', 'EMBARCANDO', 'EN_VUELO', 'ATERRIZADO', 'CANCELADO']
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const flight = await Flight.findOne({
      _id: id,
      deletedAt: null
    })

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' })
    }

    flight.status = status
    await flight.save()

    const flightObj: any = flight.toJSON()

    // Update plane status
    if (status === 'EN_VUELO') {
      try {
        await axios.put(`${PLANES_SERVICE}/planes/${flightObj.planeId}`, { status: 'EN_VUELO' })
      } catch (error) {
        // Ignore plane update errors
      }
    } else if (status === 'ATERRIZADO') {
      try {
        await axios.put(`${PLANES_SERVICE}/planes/${flightObj.planeId}`, { status: 'DISPONIBLE' })
      } catch (error) {
        // Ignore plane update errors
      }
    }

    res.json(flightObj)
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export default router









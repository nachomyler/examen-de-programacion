import express, { Request, Response } from 'express'
import Flight from '../models/Flight'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware'
import axios from 'axios'

const router = express.Router()

const PLANES_SERVICE = process.env.PLANES_SERVICE_URL || 'http://localhost:3003'

// Get all flights with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { origin, destination, status } = req.query
    const where: any = { deletedAt: null }

    if (origin) where.origin = origin
    if (destination) where.destination = destination
    if (status) where.status = status

    const flights = await Flight.find(where)
      .sort({ date: 'asc', time: 'asc' })

    // Enrich with plane data
    const enrichedFlights = await Promise.all(
      flights.map(async (flight: any) => {
        const flightObj: any = flight.toJSON()
        try {
          const planeResponse = await axios.get(`${PLANES_SERVICE}/planes/${flightObj.planeId}`)
          flightObj.plane = planeResponse.data
        } catch (error) {
          // Plane not found, continue without plane data
        }
        return flightObj
      })
    )

    res.json(enrichedFlights)
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Get flight by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const flight = await Flight.findOne({
      _id: req.params.id,
      deletedAt: null
    })

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' })
    }

    const flightObj: any = flight.toJSON()

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

// Create flight
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { origin, destination, date, time, planeId, status } = req.body

    if (!origin || !destination || !date || !time || !planeId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify plane exists
    try {
      await axios.get(`${PLANES_SERVICE}/planes/${planeId}`)
    } catch (error) {
      return res.status(404).json({ error: 'Plane not found' })
    }

    const flight = await Flight.create({
      origin,
      destination,
      date,
      time,
      planeId,
      status: status || 'PROGRAMADO',
      userId: req.user?.id
    })

    res.status(201).json(flight.toJSON())
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Update flight
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const flight = await Flight.findOne({
      _id: req.params.id,
      deletedAt: null
    })

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' })
    }

    const { origin, destination, date, time, planeId, status } = req.body

    if (planeId) {
      try {
        await axios.get(`${PLANES_SERVICE}/planes/${planeId}`)
      } catch (error) {
        return res.status(404).json({ error: 'Plane not found' })
      }
    }

    if (origin) flight.origin = origin
    if (destination) flight.destination = destination
    if (date) flight.date = date
    if (time) flight.time = time
    if (planeId) flight.planeId = planeId
    if (status) flight.status = status

    await flight.save()
    res.json(flight.toJSON())
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Delete flight (soft delete, admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const flight = await Flight.findOne({
      _id: req.params.id,
      deletedAt: null
    })

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' })
    }

    flight.deletedAt = new Date()
    await flight.save()

    res.json({ message: 'Flight deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export default router




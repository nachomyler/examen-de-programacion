import { PrismaClient } from '@prisma/client'
import { FlightStatus } from '../types'

const prisma = new PrismaClient()

describe('Flight Filtering Tests', () => {
  let testFlight1: any
  let testFlight2: any
  let testFlight3: any
  let testPlane1: any
  let testPlane2: any

  beforeAll(async () => {
    // Create test planes
    testPlane1 = await prisma.plane.create({
      data: {
        name: 'TEST001',
        model: 'Test Model 1',
        capacity: 150,
        status: 'DISPONIBLE'
      }
    })

    testPlane2 = await prisma.plane.create({
      data: {
        name: 'TEST002',
        model: 'Test Model 2',
        capacity: 200,
        status: 'DISPONIBLE'
      }
    })

    // Create test flights
    testFlight1 = await prisma.flight.create({
      data: {
        origin: 'MAD',
        destination: 'NYC',
        date: '2025-12-20',
        time: '10:00',
        planeId: testPlane1.id,
        status: FlightStatus.PROGRAMADO
      }
    })

    testFlight2 = await prisma.flight.create({
      data: {
        origin: 'BCN',
        destination: 'LON',
        date: '2025-12-21',
        time: '14:00',
        planeId: testPlane2.id,
        status: FlightStatus.EN_VUELO
      }
    })

    testFlight3 = await prisma.flight.create({
      data: {
        origin: 'MAD',
        destination: 'PAR',
        date: '2025-12-22',
        time: '18:00',
        planeId: testPlane1.id,
        status: FlightStatus.PROGRAMADO,
        deletedAt: new Date() // Soft deleted flight
      }
    })
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.flight.deleteMany({
      where: {
        id: {
          in: [testFlight1.id, testFlight2.id, testFlight3.id]
        }
      }
    })

    await prisma.plane.deleteMany({
      where: {
        id: {
          in: [testPlane1.id, testPlane2.id]
        }
      }
    })

    await prisma.$disconnect()
  })

  test('should filter flights by origin', async () => {
    const flights = await prisma.flight.findMany({
      where: {
        origin: 'MAD',
        deletedAt: null
      }
    })

    expect(flights.length).toBeGreaterThan(0)
    flights.forEach(flight => {
      expect(flight.origin).toBe('MAD')
      expect(flight.deletedAt).toBeNull()
    })
  })

  test('should filter flights by destination', async () => {
    const flights = await prisma.flight.findMany({
      where: {
        destination: 'NYC',
        deletedAt: null
      }
    })

    expect(flights.length).toBeGreaterThan(0)
    flights.forEach(flight => {
      expect(flight.destination).toBe('NYC')
      expect(flight.deletedAt).toBeNull()
    })
  })

  test('should filter flights by status', async () => {
    const flights = await prisma.flight.findMany({
      where: {
        status: FlightStatus.PROGRAMADO,
        deletedAt: null
      }
    })

    expect(flights.length).toBeGreaterThan(0)
    flights.forEach(flight => {
      expect(flight.status).toBe(FlightStatus.PROGRAMADO)
      expect(flight.deletedAt).toBeNull()
    })
  })

  test('should exclude flights with soft delete (deletedAt not null)', async () => {
    const flights = await prisma.flight.findMany({
      where: {
        deletedAt: null
      }
    })

    // Should not include testFlight3 (which has deletedAt set)
    const deletedFlight = flights.find(f => f.id === testFlight3.id)
    expect(deletedFlight).toBeUndefined()

    // All returned flights should have deletedAt as null
    flights.forEach(flight => {
      expect(flight.deletedAt).toBeNull()
    })
  })

  test('should filter by multiple criteria (origin and status)', async () => {
    const flights = await prisma.flight.findMany({
      where: {
        origin: 'MAD',
        status: FlightStatus.PROGRAMADO,
        deletedAt: null
      }
    })

    flights.forEach(flight => {
      expect(flight.origin).toBe('MAD')
      expect(flight.status).toBe(FlightStatus.PROGRAMADO)
      expect(flight.deletedAt).toBeNull()
    })
  })

  test('should exclude flights from other origins when filtering', async () => {
    const flights = await prisma.flight.findMany({
      where: {
        origin: 'MAD',
        deletedAt: null
      }
    })

    // Should not include flights from other origins
    flights.forEach(flight => {
      expect(flight.origin).toBe('MAD')
      expect(flight.origin).not.toBe('BCN')
    })
  })
})




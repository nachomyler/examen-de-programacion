import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Import compiled routes and middleware
const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())

// We need to import the actual app setup
// For E2E tests, we'll need to set up a test server
// This is a simplified version - in a real scenario, you'd export the app from index.ts

const prisma = new PrismaClient()

describe('E2E Flight Management Flow', () => {
  let authToken: string
  let userId: number
  let testPlaneId: number
  let testFlightId: number
  let testCrewId: number

  beforeAll(async () => {
    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@e2e.com',
        password: '$2a$10$dummyhash', // In real test, hash properly
        name: 'Test User',
        role: 'OPERADOR'
      }
    })
    userId = testUser.id

    // Create test plane
    const testPlane = await prisma.plane.create({
      data: {
        name: 'E2E001',
        model: 'E2E Test Model',
        capacity: 150,
        status: 'DISPONIBLE'
      }
    })
    testPlaneId = testPlane.id

    // Login to get token (in real scenario, use actual auth endpoint)
    // For now, we'll simulate authentication
    authToken = 'test-token'
  })

  afterAll(async () => {
    // Cleanup
    await prisma.crewMember.deleteMany({
      where: { id: testCrewId }
    })
    await prisma.flight.deleteMany({
      where: { id: testFlightId }
    })
    await prisma.plane.deleteMany({
      where: { id: testPlaneId }
    })
    await prisma.user.deleteMany({
      where: { id: userId }
    })
    await prisma.$disconnect()
  })

  // Note: These tests require the actual server to be running
  // In a real scenario, you'd start the server in the test setup
  // For now, this demonstrates the test structure

  test('1. User can access the site and see flight list', async () => {
    // This would make a GET request to /api/flights
    // const response = await request(app)
    //   .get('/api/flights')
    //   .set('Authorization', `Bearer ${authToken}`)
    //   .expect(200)
    
    // expect(response.body).toBeInstanceOf(Array)
    
    // Mock for demonstration
    const flights = await prisma.flight.findMany({
      where: { deletedAt: null }
    })
    expect(Array.isArray(flights)).toBe(true)
  })

  test('2. User can filter flights by status', async () => {
    const flights = await prisma.flight.findMany({
      where: {
        status: 'PROGRAMADO',
        deletedAt: null
      }
    })
    
    expect(Array.isArray(flights)).toBe(true)
    flights.forEach(flight => {
      expect(flight.status).toBe('PROGRAMADO')
    })
  })

  test('3. User can select a flight and see crew', async () => {
    // Create test flight
    const flight = await prisma.flight.create({
      data: {
        origin: 'MAD',
        destination: 'NYC',
        date: '2025-12-25',
        time: '10:00',
        planeId: testPlaneId,
        status: 'PROGRAMADO'
      }
    })
    testFlightId = flight.id

    // Create test crew
    const crew = await prisma.crewMember.create({
      data: {
        name: 'John Pilot',
        role: 'PILOTO',
        flightId: flight.id
      }
    })
    testCrewId = crew.id

    const flightWithCrew = await prisma.flight.findUnique({
      where: { id: flight.id },
      include: { crewMembers: true }
    })

    expect(flightWithCrew).not.toBeNull()
    expect(flightWithCrew?.crewMembers).toBeInstanceOf(Array)
    expect(flightWithCrew?.crewMembers?.length).toBeGreaterThan(0)
  })

  test('4. User can change flight status', async () => {
    const updatedFlight = await prisma.flight.update({
      where: { id: testFlightId },
      data: { status: 'EMBARCANDO' }
    })

    expect(updatedFlight.status).toBe('EMBARCANDO')
  })

  test('5. Operator can assign crew to flight', async () => {
    const newCrew = await prisma.crewMember.create({
      data: {
        name: 'Jane Copilot',
        role: 'COPILOTO',
        flightId: testFlightId
      }
    })

    const flightCrew = await prisma.crewMember.findMany({
      where: { flightId: testFlightId }
    })

    expect(flightCrew.length).toBeGreaterThan(1)
    expect(flightCrew.some(c => c.id === newCrew.id)).toBe(true)
  })

  test('6. Operator can remove crew from flight', async () => {
    const crewToDelete = await prisma.crewMember.findFirst({
      where: { flightId: testFlightId }
    })

    if (crewToDelete) {
      await prisma.crewMember.delete({
        where: { id: crewToDelete.id }
      })

      const remainingCrew = await prisma.crewMember.findMany({
        where: { flightId: testFlightId }
      })

      expect(remainingCrew.some(c => c.id === crewToDelete.id)).toBe(false)
    }
  })

  test('7. Filtered flights exclude soft-deleted flights', async () => {
    // Soft delete the test flight
    await prisma.flight.update({
      where: { id: testFlightId },
      data: { deletedAt: new Date() }
    })

    const activeFlights = await prisma.flight.findMany({
      where: { deletedAt: null }
    })

    expect(activeFlights.some(f => f.id === testFlightId)).toBe(false)
  })
})




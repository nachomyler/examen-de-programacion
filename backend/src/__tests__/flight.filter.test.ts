import { PrismaClient } from '@prisma/client';
import { getAllFlights } from '../controllers/flight.controller';
import { Request, Response } from 'express';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Mock response object
const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Flight Filter - Unit Tests', () => {
  let testPlane: any;
  let testUser: any;

  beforeAll(async () => {
    // Crear un avión de prueba
    testPlane = await prisma.plane.create({
      data: {
        name: 'Test Plane',
        model: 'Test Model',
        capacity: 100,
        status: 'DISPONIBLE',
        type: 'ECONOMICO',
        airline: 'Test Airlines',
        serviceClass: 'Económica 3-3'
      }
    });

    // Crear un usuario de prueba
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'testpassword',
        name: 'Test User',
        role: 'OPERADOR'
      }
    });
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await prisma.flight.deleteMany({
      where: {
        createdBy: testUser.id,
        OR: [
          { origin: { contains: 'TEST-' } },
          { origin: { in: ['España', 'México', 'Francia', 'Alemania'] } }
        ]
      }
    });
    await prisma.plane.delete({ where: { id: testPlane.id } }).catch(() => {});
    await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpiar vuelos de prueba antes de cada test (usar un patrón más amplio)
    // Eliminar vuelos creados por nuestro usuario de prueba
    await prisma.flight.deleteMany({
      where: {
        createdBy: testUser.id,
        origin: { contains: 'TEST-' }
      }
    });
  });

  describe('Filter by status', () => {
    it('should return only flights with the specified status', async () => {
      // Crear vuelos con diferentes estados usando orígenes únicos
      const uniqueOrigin1 = `TEST-STATUS-${Date.now()}`;
      const uniqueOrigin2 = `TEST-STATUS-${Date.now() + 1}`;
      
      const flight1 = await prisma.flight.create({
        data: {
          origin: uniqueOrigin1,
          destination: 'México',
          date: '2024-12-20',
          time: '10:00',
          status: 'PROGRAMADO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      const flight2 = await prisma.flight.create({
        data: {
          origin: uniqueOrigin2,
          destination: 'Alemania',
          date: '2024-12-21',
          time: '14:00',
          status: 'EN_VUELO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      const req = {
        query: { status: 'PROGRAMADO' },
        user: { id: testUser.id, email: testUser.email, role: testUser.role }
      } as unknown as AuthRequest;

      const res = createMockResponse() as Response;

      await getAllFlights(req, res);

      expect(res.json).toHaveBeenCalled();
      const flights = (res.json as jest.Mock).mock.calls[0][0];
      
      // Todos los vuelos devueltos deben tener estado PROGRAMADO
      flights.forEach((flight: any) => {
        expect(flight.status).toBe('PROGRAMADO');
      });
      
      // Nuestro vuelo con estado PROGRAMADO debe estar en los resultados
      const foundFlight = flights.find((f: any) => f.id === flight1.id);
      expect(foundFlight).toBeDefined();
      expect(foundFlight.status).toBe('PROGRAMADO');
      
      // Nuestro vuelo con estado EN_VUELO NO debe estar en los resultados
      const notFoundFlight = flights.find((f: any) => f.id === flight2.id);
      expect(notFoundFlight).toBeUndefined();
    });
  });

  describe('Filter by origin', () => {
    it('should return only flights from the specified origin', async () => {
      // Crear vuelos con orígenes únicos para evitar conflictos
      const uniqueOrigin1 = `TEST-ORIGIN-${Date.now()}`;
      const uniqueOrigin2 = `TEST-ORIGIN-${Date.now() + 1}`;
      
      const flight1 = await prisma.flight.create({
        data: {
          origin: uniqueOrigin1,
          destination: 'México',
          date: '2024-12-20',
          time: '10:00',
          status: 'PROGRAMADO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      const flight2 = await prisma.flight.create({
        data: {
          origin: uniqueOrigin2,
          destination: 'Alemania',
          date: '2024-12-21',
          time: '14:00',
          status: 'PROGRAMADO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      const req = {
        query: { origin: uniqueOrigin1 },
        user: { id: testUser.id, email: testUser.email, role: testUser.role }
      } as unknown as AuthRequest;

      const res = createMockResponse() as Response;

      await getAllFlights(req, res);

      expect(res.json).toHaveBeenCalled();
      const flights = (res.json as jest.Mock).mock.calls[0][0];
      
      // Todos los vuelos devueltos deben tener el origen especificado
      flights.forEach((flight: any) => {
        expect(flight.origin).toBe(uniqueOrigin1);
      });
      
      // Nuestro vuelo con el origen correcto debe estar en los resultados
      const foundFlight = flights.find((f: any) => f.id === flight1.id);
      expect(foundFlight).toBeDefined();
      expect(foundFlight.origin).toBe(uniqueOrigin1);
      
      // Nuestro vuelo con otro origen NO debe estar en los resultados
      const notFoundFlight = flights.find((f: any) => f.id === flight2.id);
      expect(notFoundFlight).toBeUndefined();
    });

    it('should exclude flights from other origins', async () => {
      // Usar orígenes únicos para evitar conflictos con datos existentes
      const uniqueOrigin1 = `TEST-EXCLUDE-${Date.now()}`;
      const uniqueOrigin2 = `TEST-EXCLUDE-${Date.now() + 1}`;
      
      const flight1 = await prisma.flight.create({
        data: {
          origin: uniqueOrigin1,
          destination: 'México',
          date: '2024-12-20',
          time: '10:00',
          status: 'PROGRAMADO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      const flight2 = await prisma.flight.create({
        data: {
          origin: uniqueOrigin2,
          destination: 'Alemania',
          date: '2024-12-21',
          time: '14:00',
          status: 'PROGRAMADO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      const req = {
        query: { origin: uniqueOrigin1 },
        user: { id: testUser.id, email: testUser.email, role: testUser.role }
      } as unknown as AuthRequest;

      const res = createMockResponse() as Response;

      await getAllFlights(req, res);

      expect(res.json).toHaveBeenCalled();
      const flights = (res.json as jest.Mock).mock.calls[0][0];
      
      // No debe incluir vuelos de uniqueOrigin2
      expect(flights.every((f: any) => f.origin === uniqueOrigin1)).toBe(true);
      expect(flights.find((f: any) => f.origin === uniqueOrigin2)).toBeUndefined();
      
      // Debe incluir nuestro vuelo con uniqueOrigin1
      expect(flights.find((f: any) => f.id === flight1.id)).toBeDefined();
    });
  });

  describe('Soft delete filtering', () => {
    it('should not return flights with soft delete (deletedAt not null)', async () => {
      // Usar orígenes únicos para evitar conflictos
      const uniqueOrigin1 = `TEST-SOFTDELETE-${Date.now()}`;
      const uniqueOrigin2 = `TEST-SOFTDELETE-${Date.now() + 1}`;
      
      // Crear un vuelo normal
      const activeFlight = await prisma.flight.create({
        data: {
          origin: uniqueOrigin1,
          destination: 'México',
          date: '2024-12-20',
          time: '10:00',
          status: 'PROGRAMADO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      // Crear un vuelo con baja lógica
      const deletedFlight = await prisma.flight.create({
        data: {
          origin: uniqueOrigin2,
          destination: 'Alemania',
          date: '2024-12-21',
          time: '14:00',
          status: 'PROGRAMADO',
          planeId: testPlane.id,
          createdBy: testUser.id,
          deletedAt: new Date()
        }
      });

      const req = {
        query: {},
        user: { id: testUser.id, email: testUser.email, role: testUser.role }
      } as unknown as AuthRequest;

      const res = createMockResponse() as Response;

      await getAllFlights(req, res);

      expect(res.json).toHaveBeenCalled();
      const flights = (res.json as jest.Mock).mock.calls[0][0];
      
      // El vuelo activo debe estar en los resultados
      const foundActiveFlight = flights.find((f: any) => f.id === activeFlight.id);
      expect(foundActiveFlight).toBeDefined();
      expect(foundActiveFlight.deletedAt).toBeNull();
      
      // El vuelo eliminado NO debe estar en los resultados
      const foundDeletedFlight = flights.find((f: any) => f.id === deletedFlight.id);
      expect(foundDeletedFlight).toBeUndefined();
    });
  });

  describe('Combined filters', () => {
    it('should apply multiple filters simultaneously', async () => {
      // Usar orígenes únicos para evitar conflictos
      const uniqueOrigin1 = `TEST-COMBINED-${Date.now()}`;
      const uniqueOrigin2 = `TEST-COMBINED-${Date.now() + 1}`;
      
      // Crear vuelos variados
      const matchingFlight = await prisma.flight.create({
        data: {
          origin: uniqueOrigin1,
          destination: 'México',
          date: '2024-12-20',
          time: '10:00',
          status: 'PROGRAMADO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      // Vuelo con mismo origen pero diferente estado
      const flight2 = await prisma.flight.create({
        data: {
          origin: uniqueOrigin1,
          destination: 'Francia',
          date: '2024-12-21',
          time: '14:00',
          status: 'EN_VUELO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      // Vuelo con mismo estado pero diferente origen
      const flight3 = await prisma.flight.create({
        data: {
          origin: uniqueOrigin2,
          destination: 'Alemania',
          date: '2024-12-22',
          time: '16:00',
          status: 'PROGRAMADO',
          planeId: testPlane.id,
          createdBy: testUser.id
        }
      });

      const req = {
        query: { origin: uniqueOrigin1, status: 'PROGRAMADO' },
        user: { id: testUser.id, email: testUser.email, role: testUser.role }
      } as unknown as AuthRequest;

      const res = createMockResponse() as Response;

      await getAllFlights(req, res);

      expect(res.json).toHaveBeenCalled();
      const flights = (res.json as jest.Mock).mock.calls[0][0];
      
      // Todos los vuelos deben cumplir ambos filtros
      flights.forEach((flight: any) => {
        expect(flight.origin).toBe(uniqueOrigin1);
        expect(flight.status).toBe('PROGRAMADO');
      });
      
      // El vuelo que coincide con ambos filtros debe estar en los resultados
      const foundMatchingFlight = flights.find((f: any) => f.id === matchingFlight.id);
      expect(foundMatchingFlight).toBeDefined();
      expect(foundMatchingFlight.origin).toBe(uniqueOrigin1);
      expect(foundMatchingFlight.status).toBe('PROGRAMADO');
      
      // Los vuelos que no cumplen ambos filtros NO deben estar en los resultados
      expect(flights.find((f: any) => f.id === flight2.id)).toBeUndefined();
      expect(flights.find((f: any) => f.id === flight3.id)).toBeUndefined();
    });
  });
});

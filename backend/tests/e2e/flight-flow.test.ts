import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import flightRoutes from '../../src/routes/flight.routes';
import planeRoutes from '../../src/routes/plane.routes';
import crewRoutes from '../../src/routes/crew.routes';
import authRoutes from '../../src/routes/auth.routes';
import dashboardRoutes from '../../src/routes/dashboard.routes';

const prisma = new PrismaClient();

// Crear app Express para testing
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/flights', flightRoutes);
  app.use('/api/planes', planeRoutes);
  app.use('/api/crew', crewRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  
  return app;
};

describe('Flight Flow E2E Tests', () => {
  let app: express.Application;
  let testOperator: any;
  let testPlane: any;
  let testFlight: any;
  let authToken: string;

  beforeAll(async () => {
    app = createTestApp();
    
    // Crear usuario operador de prueba
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    testOperator = await prisma.user.create({
      data: {
        email: 'e2e-operator@test.com',
        password: hashedPassword,
        name: 'Test Operator',
        role: 'OPERADOR'
      }
    });

    // Crear avión de prueba
    testPlane = await prisma.plane.create({
      data: {
        name: 'E2E Test Plane',
        model: 'Test Model 737',
        capacity: 150,
        status: 'DISPONIBLE',
        type: 'ECONOMICO',
        airline: 'Test Airlines',
        serviceClass: 'Económica 3-3'
      }
    });

    // Crear vuelo de prueba
    testFlight = await prisma.flight.create({
      data: {
        origin: 'España',
        destination: 'México',
        date: '2024-12-25',
        time: '10:00',
        status: 'PROGRAMADO',
        planeId: testPlane.id,
        createdBy: testOperator.id
      }
    });
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await prisma.crewMember.deleteMany({
      where: { flightId: testFlight.id }
    }).catch(() => {});
    await prisma.flight.delete({ where: { id: testFlight.id } }).catch(() => {});
    await prisma.plane.delete({ where: { id: testPlane.id } }).catch(() => {});
    await prisma.user.delete({ where: { id: testOperator.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  describe('Complete Flight Flow', () => {
    it('should complete the full user flow: login -> view flights -> filter -> select -> view crew -> change status -> manage crew', async () => {
      // 1. Entrar al sitio (login)
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2e-operator@test.com',
          password: 'testpassword123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();
      expect(loginResponse.body.user).toBeDefined();
      authToken = loginResponse.body.token;

      // 2. Ver listado de vuelos
      const flightsResponse = await request(app)
        .get('/api/flights')
        .set('Authorization', `Bearer ${authToken}`);

      expect(flightsResponse.status).toBe(200);
      expect(Array.isArray(flightsResponse.body)).toBe(true);
      expect(flightsResponse.body.length).toBeGreaterThan(0);
      
      // Verificar que nuestro vuelo de prueba está en la lista
      const foundFlight = flightsResponse.body.find((f: any) => f.id === testFlight.id);
      expect(foundFlight).toBeDefined();
      expect(foundFlight.origin).toBe('España');
      expect(foundFlight.destination).toBe('México');

      // 3. Filtrar por estado
      const filteredResponse = await request(app)
        .get('/api/flights')
        .query({ status: 'PROGRAMADO' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(filteredResponse.status).toBe(200);
      expect(Array.isArray(filteredResponse.body)).toBe(true);
      // Todos los vuelos deben tener estado PROGRAMADO
      filteredResponse.body.forEach((flight: any) => {
        expect(flight.status).toBe('PROGRAMADO');
      });
      // Nuestro vuelo debe estar en los resultados filtrados
      const filteredFlight = filteredResponse.body.find((f: any) => f.id === testFlight.id);
      expect(filteredFlight).toBeDefined();

      // 4. Seleccionar un vuelo (obtener por ID)
      const flightDetailResponse = await request(app)
        .get(`/api/flights/${testFlight.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(flightDetailResponse.status).toBe(200);
      expect(flightDetailResponse.body.id).toBe(testFlight.id);
      expect(flightDetailResponse.body.origin).toBe('España');
      expect(flightDetailResponse.body.destination).toBe('México');

      // 5. Ver tripulación asignada
      const crewResponse = await request(app)
        .get(`/api/crew/flight/${testFlight.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(crewResponse.status).toBe(200);
      expect(Array.isArray(crewResponse.body)).toBe(true);
      // Inicialmente no debería haber tripulación
      expect(crewResponse.body.length).toBe(0);

      // 6. Cambiar el estado del vuelo (simulado)
      const statusUpdateResponse = await request(app)
        .put(`/api/dashboard/flight/${testFlight.id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'EMBARCANDO' });

      expect(statusUpdateResponse.status).toBe(200);
      expect(statusUpdateResponse.body.status).toBe('EMBARCANDO');

      // Verificar que el estado cambió
      const updatedFlightResponse = await request(app)
        .get(`/api/flights/${testFlight.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(updatedFlightResponse.body.status).toBe('EMBARCANDO');

      // 7. Asignar tripulación
      const addCrewResponse1 = await request(app)
        .post(`/api/crew/flight/${testFlight.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Juan Pérez',
          role: 'PILOTO'
        });

      expect(addCrewResponse1.status).toBe(201);
      expect(addCrewResponse1.body.name).toBe('Juan Pérez');
      expect(addCrewResponse1.body.role).toBe('PILOTO');
      expect(addCrewResponse1.body.flightId).toBe(testFlight.id);

      const addCrewResponse2 = await request(app)
        .post(`/api/crew/flight/${testFlight.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'María García',
          role: 'COPILOTO'
        });

      expect(addCrewResponse2.status).toBe(201);
      expect(addCrewResponse2.body.name).toBe('María García');
      expect(addCrewResponse2.body.role).toBe('COPILOTO');

      // Verificar que la tripulación fue asignada
      const crewAfterAddResponse = await request(app)
        .get(`/api/crew/flight/${testFlight.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(crewAfterAddResponse.status).toBe(200);
      expect(crewAfterAddResponse.body.length).toBe(2);
      expect(crewAfterAddResponse.body.some((c: any) => c.name === 'Juan Pérez' && c.role === 'PILOTO')).toBe(true);
      expect(crewAfterAddResponse.body.some((c: any) => c.name === 'María García' && c.role === 'COPILOTO')).toBe(true);

      // 8. Quitar tripulación
      const crewMemberId = crewAfterAddResponse.body.find((c: any) => c.name === 'María García').id;
      
      const removeCrewResponse = await request(app)
        .delete(`/api/crew/${crewMemberId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(removeCrewResponse.status).toBe(200);

      // Verificar que la tripulación fue removida
      const crewAfterRemoveResponse = await request(app)
        .get(`/api/crew/flight/${testFlight.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(crewAfterRemoveResponse.status).toBe(200);
      expect(crewAfterRemoveResponse.body.length).toBe(1);
      expect(crewAfterRemoveResponse.body[0].name).toBe('Juan Pérez');
      expect(crewAfterRemoveResponse.body.find((c: any) => c.name === 'María García')).toBeUndefined();
    });
  });
});

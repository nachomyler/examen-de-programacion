import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Iniciando seed...');

    // Crear usuarios
    const adminPassword = await bcrypt.hash('admin123', 10);
    const operatorPassword = await bcrypt.hash('operador123', 10);
    const userPassword = await bcrypt.hash('usuario123', 10);

    // Verificar si los usuarios ya existen
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@skytrack.com' }
    });
    const existingOperator = await prisma.user.findUnique({
      where: { email: 'operador@skytrack.com' }
    });
    const existingUser = await prisma.user.findUnique({
      where: { email: 'usuario@skytrack.com' }
    });

    if (!existingAdmin) {
      const admin = await prisma.user.create({
        data: {
          email: 'admin@skytrack.com',
          password: adminPassword,
          name: 'Administrador',
          role: 'ADMIN'
        }
      });
      console.log(`✅ Admin creado: ${admin.email}`);
    } else {
      console.log(`ℹ️  Admin ya existe: ${existingAdmin.email}`);
    }

    if (!existingOperator) {
      const operator = await prisma.user.create({
        data: {
          email: 'operador@skytrack.com',
          password: operatorPassword,
          name: 'Operador',
          role: 'OPERADOR'
        }
      });
      console.log(`✅ Operador creado: ${operator.email}`);
    } else {
      console.log(`ℹ️  Operador ya existe: ${existingOperator.email}`);
    }

    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: 'usuario@skytrack.com',
          password: userPassword,
          name: 'Usuario',
          role: 'USUARIO'
        }
      });
      console.log(`✅ Usuario creado: ${user.email}`);
    } else {
      console.log(`ℹ️  Usuario ya existe: ${existingUser.email}`);
    }

    // Obtener los IDs de los usuarios (creados o existentes)
    const admin = existingAdmin || await prisma.user.findUnique({
      where: { email: 'admin@skytrack.com' }
    });
    const operator = existingOperator || await prisma.user.findUnique({
      where: { email: 'operador@skytrack.com' }
    });

    if (!admin || !operator) {
      throw new Error('No se pudieron obtener los usuarios admin u operador');
    }

    // Crear aviones si no existen
    const existingPlanes = await prisma.plane.findMany();
    
    let plane1, plane2, plane3;
    
    if (existingPlanes.length === 0) {
      plane1 = await prisma.plane.create({
        data: {
          name: 'Boeing 737-800',
          model: '737-800',
          capacity: 189,
          status: 'DISPONIBLE',
          type: 'ECONOMICO',
          airline: 'SkyTrack Airlines',
          serviceClass: 'Económico Premium 2-4-2'
        }
      });
      console.log(`✅ Avión 1 creado: ${plane1.name}`);

      plane2 = await prisma.plane.create({
        data: {
          name: 'Airbus A320',
          model: 'A320',
          capacity: 180,
          status: 'DISPONIBLE',
          type: 'ECONOMICO',
          airline: 'SkyTrack Airlines',
          serviceClass: 'Clase Ejecutiva 2-2'
        }
      });
      console.log(`✅ Avión 2 creado: ${plane2.name}`);

      plane3 = await prisma.plane.create({
        data: {
          name: 'Boeing 787 Dreamliner',
          model: '787-9',
          capacity: 290,
          status: 'DISPONIBLE',
          type: 'ECONOMICO',
          airline: 'SkyTrack Airlines',
          serviceClass: 'Primera Clase 1-2-1'
        }
      });
      console.log(`✅ Avión 3 creado: ${plane3.name}`);
    } else {
      plane1 = existingPlanes[0];
      plane2 = existingPlanes[1] || existingPlanes[0];
      plane3 = existingPlanes[2] || existingPlanes[0];
      console.log(`ℹ️  Usando aviones existentes`);
    }

    // Verificar si los vuelos ya existen
    const existingFlights = await prisma.flight.findMany({
      where: {
        createdBy: {
          in: [admin.id, operator.id]
        }
      }
    });

    if (existingFlights.length === 0) {
      // Vuelo 1: Creado por el Administrador
      const flight1 = await prisma.flight.create({
        data: {
          origin: 'España',
          destination: 'México',
          date: '2024-12-20',
          time: '10:30',
          status: 'PROGRAMADO',
          planeId: plane1.id,
          createdBy: admin.id
        }
      });
      console.log(`✅ Vuelo 1 creado por Administrador: ${flight1.origin} → ${flight1.destination}`);

      // Vuelo 2: Creado por el Operador
      const flight2 = await prisma.flight.create({
        data: {
          origin: 'Estados Unidos',
          destination: 'Francia',
          date: '2024-12-21',
          time: '14:15',
          status: 'PROGRAMADO',
          planeId: plane2.id,
          createdBy: operator.id
        }
      });
      console.log(`✅ Vuelo 2 creado por Operador: ${flight2.origin} → ${flight2.destination}`);

      // Vuelo 3: Creado por el Operador
      const flight3 = await prisma.flight.create({
        data: {
          origin: 'Alemania',
          destination: 'Reino Unido',
          date: '2024-12-22',
          time: '08:45',
          status: 'PROGRAMADO',
          planeId: plane3.id,
          createdBy: operator.id
        }
      });
      console.log(`✅ Vuelo 3 creado por Operador: ${flight3.origin} → ${flight3.destination}`);
    } else {
      console.log(`ℹ️  Vuelos ya existen, no se crearon nuevos`);
    }

    console.log('✅ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();


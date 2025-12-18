import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { PlaneStatus } from '../types';

const prisma = new PrismaClient();

export const getAllPlanes = async (req: AuthRequest, res: Response) => {
  try {
    const planes = await prisma.plane.findMany({
      include: {
        flights: {
          where: {
            deletedAt: null
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(planes);
  } catch (error) {
    console.error('Error al obtener aviones:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPlaneById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const plane = await prisma.plane.findUnique({
      where: { id: parseInt(id) },
      include: {
        flights: {
          where: {
            deletedAt: null
          }
        }
      }
    });
    if (!plane) {
      return res.status(404).json({ error: 'Plane not found' });
    }
    res.json(plane);
  } catch (error) {
    console.error('Error al obtener avión:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPlane = async (req: AuthRequest, res: Response) => {
  try {
    const { name, model, capacity, status, type, airline, serviceClass } = req.body;
    if (!name || !model || !capacity || !airline || !serviceClass) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const plane = await prisma.plane.create({
      data: {
        name,
        model,
        capacity: parseInt(capacity),
        status: status || PlaneStatus.DISPONIBLE,
        type: type || 'ECONOMICO',
        airline,
        serviceClass
      }
    });
    res.status(201).json(plane);
  } catch (error) {
    console.error('Error al crear avión:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePlane = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, model, capacity, status, type, airline, serviceClass } = req.body;

    const existingPlane = await prisma.plane.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingPlane) {
      return res.status(404).json({ error: 'Plane not found' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (model) updateData.model = model;
    if (capacity) updateData.capacity = parseInt(capacity);
    if (status) updateData.status = status;
    if (type) updateData.type = type;
    if (airline) updateData.airline = airline;
    if (serviceClass) updateData.serviceClass = serviceClass;

    const plane = await prisma.plane.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.json(plane);
  } catch (error) {
    console.error('Error al actualizar avión:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};








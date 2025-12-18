import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getCrewByFlight = async (req: AuthRequest, res: Response) => {
  try {
    const { flightId } = req.params;
    const flight = await prisma.flight.findFirst({
      where: {
        id: parseInt(flightId),
        deletedAt: null
      }
    });
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    const crewMembers = await prisma.crewMember.findMany({
      where: {
        flightId: parseInt(flightId)
      },
      orderBy: {
        role: 'asc'
      }
    });
    res.json(crewMembers);
  } catch (error) {
    console.error('Error al obtener tripulación:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addCrewMember = async (req: AuthRequest, res: Response) => {
  try {
    const { flightId } = req.params;
    const { name, role } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const flight = await prisma.flight.findFirst({
      where: {
        id: parseInt(flightId),
        deletedAt: null
      }
    });
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    const crewMember = await prisma.crewMember.create({
      data: {
        name,
        role: role,
        flightId: parseInt(flightId)
      }
    });
    res.status(201).json(crewMember);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Este tripulante ya está asignado a este vuelo' });
    }
    console.error('Error al agregar tripulante:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeCrewMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const crewMember = await prisma.crewMember.findUnique({
      where: { id: parseInt(id) }
    });
    if (!crewMember) {
      return res.status(404).json({ error: 'Crew member not found' });
    }
    await prisma.crewMember.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Crew member removed successfully' });
  } catch (error) {
    console.error('Error al eliminar tripulante:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};








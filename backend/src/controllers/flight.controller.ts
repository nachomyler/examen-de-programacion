import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { FlightStatus } from '../types';

const prisma = new PrismaClient();

export const getAllFlights = async (req: AuthRequest, res: Response) => {
  try {
    const { origin, destination, status } = req.query;
    const where: any = {
      deletedAt: null
    };

    if (origin) {
      where.origin = origin;
    }
    if (destination) {
      where.destination = destination;
    }
    if (status) {
      where.status = status;
    }

    const flights = await prisma.flight.findMany({
      where,
      include: {
        plane: true,
        crewMembers: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        takenBy: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
    res.json(flights);
  } catch (error) {
    console.error('Error al obtener vuelos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFlightById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const flight = await prisma.flight.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      },
      include: {
        plane: true,
        crewMembers: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        takenBy: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    console.error('Error al obtener vuelo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createFlight = async (req: AuthRequest, res: Response) => {
  try {
    const { origin, destination, date, time, planeId, status } = req.body;
    if (!origin || !destination || !date || !time || !planeId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const plane = await prisma.plane.findUnique({
      where: { id: parseInt(planeId) }
    });
    if (!plane) {
      return res.status(404).json({ error: 'Plane not found' });
    }

    const flight = await prisma.flight.create({
      data: {
        origin,
        destination,
        date,
        time,
        planeId: parseInt(planeId),
        status: status || FlightStatus.PROGRAMADO,
        createdBy: req.user?.id || null // Guardar quién creó el vuelo
      },
      include: {
        plane: true,
        crewMembers: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        takenBy: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    res.status(201).json(flight);
  } catch (error) {
    console.error('Error al crear vuelo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateFlight = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { origin, destination, date, time, planeId, status } = req.body;

    const existingFlight = await prisma.flight.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      }
    });

    if (!existingFlight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const updateData: any = {};
    if (origin) updateData.origin = origin;
    if (destination) updateData.destination = destination;
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (status) updateData.status = status;
    if (planeId) {
      const plane = await prisma.plane.findUnique({
        where: { id: parseInt(planeId) }
      });
      if (!plane) {
        return res.status(404).json({ error: 'Plane not found' });
      }
      updateData.planeId = parseInt(planeId);
    }

    const updatedFlight = await prisma.flight.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        plane: true,
        crewMembers: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        takenBy: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json(updatedFlight);
  } catch (error) {
    console.error('Error al actualizar vuelo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteFlight = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const flight = await prisma.flight.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      }
    });

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    await prisma.flight.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });

    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Error al eliminar vuelo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};








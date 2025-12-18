import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Tomar un vuelo (asignarse a él)
export const takeFlight = async (req: AuthRequest, res: Response) => {
  try {
    const { flightId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const flight = await prisma.flight.findFirst({
      where: {
        id: parseInt(flightId),
        deletedAt: null
      }
    });

    if (!flight) {
      return res.status(404).json({ error: 'Vuelo no encontrado' });
    }

    // Verificar si el usuario ya tomó este vuelo
    const existing = await prisma.userFlight.findUnique({
      where: {
        userId_flightId: {
          userId,
          flightId: parseInt(flightId)
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Ya has tomado este vuelo' });
    }

    const userFlight = await prisma.userFlight.create({
      data: {
        userId,
        flightId: parseInt(flightId)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        flight: {
          include: {
            plane: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Vuelo tomado correctamente',
      userFlight
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya has tomado este vuelo' });
    }
    console.error('Error al tomar vuelo:', error);
    res.status(500).json({ error: 'Error al tomar vuelo' });
  }
};

// Liberar un vuelo (dejarlo)
export const releaseFlight = async (req: AuthRequest, res: Response) => {
  try {
    const { flightId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const userFlight = await prisma.userFlight.findUnique({
      where: {
        userId_flightId: {
          userId,
          flightId: parseInt(flightId)
        }
      }
    });

    if (!userFlight) {
      return res.status(404).json({ error: 'No has tomado este vuelo' });
    }

    await prisma.userFlight.delete({
      where: {
        id: userFlight.id
      }
    });

    res.json({ message: 'Vuelo liberado correctamente' });
  } catch (error) {
    console.error('Error al liberar vuelo:', error);
    res.status(500).json({ error: 'Error al liberar vuelo' });
  }
};

// Obtener vuelos tomados por el usuario actual
export const getMyFlights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const userFlights = await prisma.userFlight.findMany({
      where: {
        userId
      },
      include: {
        flight: {
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
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(userFlights.map(uf => ({
      ...uf.flight,
      takenAt: uf.createdAt
    })));
  } catch (error) {
    console.error('Error al obtener mis vuelos:', error);
    res.status(500).json({ error: 'Error al obtener mis vuelos' });
  }
};

// Verificar si el usuario tomó un vuelo específico
export const checkFlightTaken = async (req: AuthRequest, res: Response) => {
  try {
    const { flightId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const userFlight = await prisma.userFlight.findUnique({
      where: {
        userId_flightId: {
          userId,
          flightId: parseInt(flightId)
        }
      }
    });

    res.json({ taken: !!userFlight });
  } catch (error) {
    console.error('Error al verificar vuelo:', error);
    res.status(500).json({ error: 'Error al verificar vuelo' });
  }
};








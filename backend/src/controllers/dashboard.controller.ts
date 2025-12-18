import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getActiveFlights = async (req: AuthRequest, res: Response) => {
  try {
    const flights = await prisma.flight.findMany({
      where: {
        status: {
          in: ['EMBARCANDO', 'EN_VUELO']
        },
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
      },
      orderBy: {
        date: 'asc'
      }
    });
    res.json(flights);
  } catch (error) {
    console.error('Error al obtener vuelos activos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNextFlight = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const nextFlight = await prisma.flight.findFirst({
      where: {
        status: 'PROGRAMADO',
        deletedAt: null,
        date: {
          gte: today
        }
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
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });
    res.json(nextFlight || null);
  } catch (error) {
    console.error('Error al obtener próximo vuelo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Nuevo endpoint para obtener todos los vuelos del dashboard
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const commonInclude = {
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
    };

    // Vuelos en curso
    let currentFlights: any[] = [];
    try {
      currentFlights = await prisma.flight.findMany({
        where: {
          status: 'EN_VUELO',
          deletedAt: null
        },
        include: commonInclude,
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (err: any) {
      console.warn('Error al obtener vuelos en curso:', err?.message || err);
      currentFlights = [];
    }

    // Vuelos creados por operadores/admins
    let operatorFlights: any[] = [];
    try {
      const operatorUsers = await prisma.user.findMany({
        where: {
          role: {
            in: ['OPERADOR', 'ADMIN']
          }
        },
        select: {
          id: true
        }
      });

      const operatorUserIds = operatorUsers.map(u => u.id);
      
      if (operatorUserIds.length > 0) {
        operatorFlights = await prisma.flight.findMany({
          where: {
            deletedAt: null,
            createdBy: {
              in: operatorUserIds,
              not: null
            }
          },
          include: commonInclude,
          orderBy: {
            createdAt: 'desc'
          }
        });
      }
    } catch (err: any) {
      console.warn('Error al obtener vuelos de operadores:', err?.message || err);
      operatorFlights = [];
    }

    // Próximos vuelos
    let nextFlights: any[] = [];
    try {
      nextFlights = await prisma.flight.findMany({
        where: {
          status: {
            in: ['PROGRAMADO', 'EMBARCANDO']
          },
          deletedAt: null
        },
        include: commonInclude,
        orderBy: [
          {
            date: 'asc'
          },
          {
            time: 'asc'
          },
          {
            createdAt: 'desc'
          }
        ],
        take: 20
      });
    } catch (err: any) {
      console.warn('Error al obtener próximos vuelos:', err?.message || err);
      nextFlights = [];
    }

    // Vuelos tomados por el usuario actual
    let myTakenFlights: number[] = [];
    if (userId) {
      try {
        const tableExists = await prisma.$queryRaw<Array<{ name: string }>>`
          SELECT name FROM sqlite_master WHERE type='table' AND name='UserFlight';
        `;
        
        if (tableExists.length > 0) {
          const takenFlights = await prisma.userFlight.findMany({
            where: { userId },
            select: { flightId: true }
          });
          myTakenFlights = takenFlights.map(tf => tf.flightId);
        }
      } catch (err: any) {
        console.warn('Error al obtener vuelos tomados:', err?.message || err);
        myTakenFlights = [];
      }
    }

    res.json({
      currentFlights,
      nextFlights,
      operatorFlights,
      myTakenFlights
    });
  } catch (error: any) {
    console.error('Error al obtener dashboard:', error);
    res.status(500).json({ 
      error: 'Error al obtener dashboard',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateFlightStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['PROGRAMADO', 'EMBARCANDO', 'EN_VUELO', 'ATERRIZADO', 'CANCELADO'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const flight = await prisma.flight.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      }
    });

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const updatedFlight = await prisma.flight.update({
      where: { id: parseInt(id) },
      data: { status: status },
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

    // Update plane status if flight is in flight
    if (status === 'EN_VUELO') {
      await prisma.plane.update({
        where: { id: flight.planeId },
        data: { status: 'EN_VUELO' }
      });
    } else if (status === 'ATERRIZADO') {
      await prisma.plane.update({
        where: { id: flight.planeId },
        data: { status: 'DISPONIBLE' }
      });
    }

    res.json(updatedFlight);
  } catch (error) {
    console.error('Error al actualizar estado del vuelo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};








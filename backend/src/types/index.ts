import { Request } from 'express';

export enum FlightStatus {
  PROGRAMADO = 'PROGRAMADO',
  EMBARCANDO = 'EMBARCANDO',
  EN_VUELO = 'EN_VUELO',
  ATERRIZADO = 'ATERRIZADO',
  CANCELADO = 'CANCELADO'
}

export enum PlaneStatus {
  DISPONIBLE = 'DISPONIBLE',
  EN_VUELO = 'EN_VUELO',
  EN_MANTENIMIENTO = 'EN_MANTENIMIENTO'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR',
  USUARIO = 'USUARIO'
}

export enum CrewRole {
  PILOTO = 'PILOTO',
  COPILOTO = 'COPILOTO',
  AUXILIAR = 'AUXILIAR'
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}



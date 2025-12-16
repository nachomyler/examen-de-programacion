// Tipos compartidos entre microservicios

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

export interface Flight {
  _id?: string
  origin: string
  destination: string
  date: string
  time: string
  status: FlightStatus
  planeId: string
  deletedAt?: Date | null
  userId?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Plane {
  _id?: string
  code: string
  model: string
  capacity: number
  status: PlaneStatus
  createdAt?: Date
  updatedAt?: Date
}

export interface CrewMember {
  _id?: string
  name: string
  role: CrewRole
  flightId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  _id?: string
  email: string
  password: string
  name: string
  role: UserRole
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthResponse {
  token: string
  user: {
    _id: string
    email: string
    name: string
    role: UserRole
  }
}




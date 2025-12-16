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
  id: string
  origin: string
  destination: string
  date: string
  time: string
  status: FlightStatus
  planeId: string
  deletedAt?: string | null
  createdBy?: number | null
  creator?: {
    id: number
    name: string
    email: string
    role: string
  }
  plane?: Plane
  crewMembers?: CrewMember[]
  takenBy?: Array<{
    id: number
    userId: number
    flightId: number
    user: {
      id: number
      name: string
      email: string
    }
    createdAt: string
  }>
  takenAt?: string
}

export interface Plane {
  id: string
  name: string
  model: string
  capacity: number
  status: PlaneStatus
  type: string // PRIVADO, ECONOMICO
  airline: string
  serviceClass: string
  flights?: Flight[]
}

export interface CrewMember {
  id: string
  name: string
  role: CrewRole
  flightId: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}


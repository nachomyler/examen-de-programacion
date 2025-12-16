import axios from 'axios'
import type { Flight, Plane, CrewMember, LoginCredentials, RegisterData, AuthResponse, FlightStatus } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - limpiar y redirigir al login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Solo redirigir si no estamos ya en login o register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      if (response.data && response.data.token && response.data.user) {
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
      }
      throw new Error('Invalid response from server')
    } catch (error: any) {
      // Limpiar localStorage en caso de error
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      throw error
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    if (response.data && response.data.token && response.data.user) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data
    }
    throw new Error('Invalid response from server')
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: (): any => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}

// Flight endpoints
export const flightService = {
  getAll: async (params?: { origin?: string; destination?: string; status?: FlightStatus }): Promise<Flight[]> => {
    const response = await api.get<Flight[]>('/flights', { params })
    return response.data
  },

  getById: async (id: string): Promise<Flight> => {
    const response = await api.get<Flight>(`/flights/${id}`)
    return response.data
  },

  create: async (flight: Partial<Flight>): Promise<Flight> => {
    const response = await api.post<Flight>('/flights', flight)
    return response.data
  },

  update: async (id: string, flight: Partial<Flight>): Promise<Flight> => {
    const response = await api.put<Flight>(`/flights/${id}`, flight)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/flights/${id}`)
  },

  updateStatus: async (id: string, status: FlightStatus): Promise<Flight> => {
    const response = await api.put<Flight>(`/dashboard/flight/${id}/status`, { status })
    return response.data
  },
}

// Plane endpoints
export const planeService = {
  getAll: async (): Promise<Plane[]> => {
    const response = await api.get<Plane[]>('/planes')
    return response.data
  },

  create: async (plane: Partial<Plane>): Promise<Plane> => {
    const response = await api.post<Plane>('/planes', plane)
    return response.data
  },

  update: async (id: string, plane: Partial<Plane>): Promise<Plane> => {
    const response = await api.put<Plane>(`/planes/${id}`, plane)
    return response.data
  },
}

// Crew endpoints
export const crewService = {
  getByFlight: async (flightId: string): Promise<CrewMember[]> => {
    const response = await api.get<CrewMember[]>(`/crew/flight/${flightId}`)
    return response.data
  },

  addToFlight: async (flightId: string, crew: Partial<CrewMember>): Promise<CrewMember> => {
    const response = await api.post<CrewMember>(`/crew/flight/${flightId}`, crew)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/crew/${id}`)
  },
}

// Dashboard endpoints
export const dashboardService = {
  getActiveFlights: async (): Promise<Flight[]> => {
    const response = await api.get<Flight[]>('/dashboard/active')
    return response.data
  },

  getNextFlights: async (): Promise<Flight[]> => {
    const response = await api.get<Flight | null>('/dashboard/next')
    // If null, return empty array; if single flight, return array with it
    return response.data ? [response.data] : []
  },

  getDashboard: async (): Promise<{ 
    currentFlights: Flight[]; 
    nextFlights: Flight[]; 
    operatorFlights: Flight[];
    myTakenFlights: number[];
  }> => {
    const response = await api.get('/dashboard')
    return response.data
  },
}

// UserFlight endpoints (para que usuarios tomen vuelos)
export const userFlightService = {
  takeFlight: async (flightId: string): Promise<void> => {
    await api.post(`/user-flights/flight/${flightId}/take`)
  },
  
  releaseFlight: async (flightId: string): Promise<void> => {
    await api.delete(`/user-flights/flight/${flightId}/release`)
  },
  
  getMyFlights: async (): Promise<Flight[]> => {
    const response = await api.get<Flight[]>('/user-flights/my-flights')
    return response.data
  },
  
  checkFlightTaken: async (flightId: string): Promise<{ taken: boolean }> => {
    const response = await api.get<{ taken: boolean }>(`/user-flights/flight/${flightId}/check`)
    return response.data
  },
}

export default api

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'
import { authService } from '../services/api'
import type { User, LoginCredentials, RegisterData } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Export hook after context definition to fix Fast Refresh warning
const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { useAuth }

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      if (response && response.user) {
        // Actualizar el estado del usuario inmediatamente
        setUser(response.user)
        // Retornar después de un pequeño delay para asegurar que el estado se actualice
        return Promise.resolve()
      } else {
        throw new Error('Login failed: No user data received')
      }
    } catch (error) {
      // Limpiar localStorage si hay un error
      authService.logout()
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data)
      if (response && response.user) {
        setUser(response.user)
        return Promise.resolve()
      } else {
        throw new Error('Registration failed: No user data received')
      }
    } catch (error) {
      // Limpiar localStorage si hay un error
      authService.logout()
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  // Verificar autenticación basándose en localStorage y estado
  const isAuthenticated = useMemo(() => {
    if (user) return true
    const token = localStorage.getItem('token')
    const currentUser = authService.getCurrentUser()
    return !!(token && currentUser)
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}








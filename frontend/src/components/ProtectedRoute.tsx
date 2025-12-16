import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Verificar también localStorage directamente como respaldo
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const isAuth = isAuthenticated || !!(token && user)

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute



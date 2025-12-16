import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardService, flightService, userFlightService } from '../services/api'
import type { Flight, FlightStatus } from '../types'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeFlights, setActiveFlights] = useState<Flight[]>([])
  const [nextFlights, setNextFlights] = useState<Flight[]>([])
  const [operatorFlights, setOperatorFlights] = useState<Flight[]>([])
  const [myTakenFlights, setMyTakenFlights] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [takingFlight, setTakingFlight] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    loadData()
    // Actualizar cada 10 segundos para capturar vuelos nuevos
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const dashboardData = await dashboardService.getDashboard()
      setActiveFlights(Array.isArray(dashboardData.currentFlights) ? dashboardData.currentFlights.map(f => ({ ...f, id: String(f.id) })) : [])
      setNextFlights(Array.isArray(dashboardData.nextFlights) ? dashboardData.nextFlights.map(f => ({ ...f, id: String(f.id) })) : [])
      setOperatorFlights(Array.isArray(dashboardData.operatorFlights) ? dashboardData.operatorFlights.map(f => ({ ...f, id: String(f.id) })) : [])
      setMyTakenFlights(Array.isArray(dashboardData.myTakenFlights) ? dashboardData.myTakenFlights.map(id => Number(id)) : [])
    } catch (error: any) {
      console.error('Error loading dashboard:', error)
      if (error.response?.status !== 401) {
        setActiveFlights([])
        setNextFlights([])
        setOperatorFlights([])
        setMyTakenFlights([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (flightId: string, newStatus: FlightStatus) => {
    setUpdatingStatus(flightId)
    try {
      await flightService.updateStatus(flightId, newStatus)
      await loadData()
    } catch (error) {
      console.error('Error updating flight status:', error)
      alert('Error al actualizar el estado del vuelo')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleTakeFlight = async (flightId: string) => {
    setTakingFlight(flightId)
    try {
      await userFlightService.takeFlight(flightId)
      await loadData()
    } catch (error: any) {
      console.error('Error taking flight:', error)
      alert(error.response?.data?.error || 'Error al tomar el vuelo')
    } finally {
      setTakingFlight(null)
    }
  }

  const handleReleaseFlight = async (flightId: string) => {
    setTakingFlight(flightId)
    try {
      await userFlightService.releaseFlight(flightId)
      await loadData()
    } catch (error: any) {
      console.error('Error releasing flight:', error)
      alert(error.response?.data?.error || 'Error al liberar el vuelo')
    } finally {
      setTakingFlight(null)
    }
  }

  const isFlightTaken = (flightId: string) => {
    return myTakenFlights.includes(Number(flightId))
  }

  const isUser = user?.role === 'USUARIO'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <header style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0 }}>✈️ SkyTrack Airlines - Panel de Estado de Vuelos</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span>Bienvenido, {user?.name}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid white',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/flights')}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Ver Todos los Vuelos
          </button>
          {(user?.role === 'OPERADOR' || user?.role === 'ADMIN') && (
            <button
              onClick={() => navigate('/planes')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Gestionar Aviones
            </button>
          )}
        </div>

        {/* Sección de vuelos creados por operadores */}
        {operatorFlights.length > 0 && (
          <section style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ marginTop: 0, color: '#1e3a8a', marginBottom: '1rem' }}>
              ✈️ Vuelos Creados por Operadores/Administradores
              <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal', marginLeft: '0.5rem' }}>
                ({operatorFlights.length} vuelo{operatorFlights.length !== 1 ? 's' : ''})
              </span>
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Origen</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Destino</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Fecha</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Hora</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Estado</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Creado por</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Tomado por</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {operatorFlights.map((flight) => {
                    const taken = isFlightTaken(flight.id)
                    return (
                      <tr key={flight.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem' }}>{flight.origin}</td>
                        <td style={{ padding: '0.75rem' }}>{flight.destination}</td>
                        <td style={{ padding: '0.75rem' }}>{flight.date}</td>
                        <td style={{ padding: '0.75rem' }}>{flight.time}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            background: flight.status === 'EN_VUELO' ? '#d1fae5' : flight.status === 'PROGRAMADO' ? '#dbeafe' : '#fef3c7',
                            color: flight.status === 'EN_VUELO' ? '#065f46' : flight.status === 'PROGRAMADO' ? '#1e40af' : '#92400e'
                          }}>
                            {flight.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                          {flight.creator ? (
                            <span>{flight.creator.name} ({flight.creator.role})</span>
                          ) : (
                            <span style={{ color: '#999' }}>N/A</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                          {flight.takenBy && flight.takenBy.length > 0 ? (
                            <span>{flight.takenBy.map(tb => tb.user.name).join(', ')}</span>
                          ) : (
                            <span style={{ color: '#999' }}>Ninguno</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {isUser && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                              {!taken ? (
                                <button
                                  onClick={() => handleTakeFlight(flight.id)}
                                  disabled={takingFlight === flight.id}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    opacity: takingFlight === flight.id ? 0.6 : 1
                                  }}
                                >
                                  {takingFlight === flight.id ? 'Tomando...' : 'Tomar Vuelo'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleReleaseFlight(flight.id)}
                                  disabled={takingFlight === flight.id}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    opacity: takingFlight === flight.id ? 0.6 : 1
                                  }}
                                >
                                  {takingFlight === flight.id ? 'Liberando...' : 'Liberar Vuelo'}
                                </button>
                              )}
                              {taken && (
                                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>
                                  ✓ EN CURSO
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          <section style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, color: '#1e3a8a' }}>Vuelos Activos</h2>
            {activeFlights.length === 0 ? (
              <p style={{ color: '#666' }}>No hay vuelos activos</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeFlights.map((flight) => (
                  <div key={flight.id} style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {flight.origin} → {flight.destination}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {flight.date} a las {flight.time} | Estado: {flight.status}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {flight.status === 'PROGRAMADO' && (
                        <button
                          onClick={() => handleStatusChange(flight.id, 'EMBARCANDO' as FlightStatus)}
                          disabled={updatingStatus === flight.id}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            opacity: updatingStatus === flight.id ? 0.6 : 1
                          }}
                        >
                          {updatingStatus === flight.id ? 'Actualizando...' : 'Iniciar Embarque'}
                        </button>
                      )}
                      {flight.status === 'EMBARCANDO' && (
                        <button
                          onClick={() => handleStatusChange(flight.id, 'EN_VUELO' as FlightStatus)}
                          disabled={updatingStatus === flight.id}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            opacity: updatingStatus === flight.id ? 0.6 : 1
                          }}
                        >
                          {updatingStatus === flight.id ? 'Actualizando...' : 'Iniciar Vuelo'}
                        </button>
                      )}
                      {flight.status === 'EN_VUELO' && (
                        <button
                          onClick={() => handleStatusChange(flight.id, 'ATERRIZADO' as FlightStatus)}
                          disabled={updatingStatus === flight.id}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            opacity: updatingStatus === flight.id ? 0.6 : 1
                          }}
                        >
                          {updatingStatus === flight.id ? 'Actualizando...' : 'Aterrizar'}
                        </button>
                      )}
                      {isUser && !isFlightTaken(flight.id) && (
                        <button
                          onClick={() => handleTakeFlight(flight.id)}
                          disabled={takingFlight === flight.id}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#8b5cf6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            opacity: takingFlight === flight.id ? 0.6 : 1
                          }}
                        >
                          {takingFlight === flight.id ? 'Tomando...' : 'Tomar Vuelo'}
                        </button>
                      )}
                      {isUser && isFlightTaken(flight.id) && (
                        <>
                          <button
                            onClick={() => handleReleaseFlight(flight.id)}
                            disabled={takingFlight === flight.id}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              opacity: takingFlight === flight.id ? 0.6 : 1
                            }}
                          >
                            {takingFlight === flight.id ? 'Liberando...' : 'Liberar'}
                          </button>
                          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', alignSelf: 'center' }}>
                            ✓ EN CURSO
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, color: '#1e3a8a' }}>Próximos Vuelos</h2>
            {nextFlights.length === 0 ? (
              <p style={{ color: '#666' }}>No hay vuelos programados</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {nextFlights.map((flight) => {
                  const taken = isFlightTaken(flight.id)
                  return (
                    <div key={flight.id} style={{
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {flight.origin} → {flight.destination}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {flight.date} a las {flight.time} | Estado: {flight.status}
                      </div>
                      {flight.creator && (
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          Creado por: {flight.creator.name} ({flight.creator.role})
                        </div>
                      )}
                      {flight.takenBy && flight.takenBy.length > 0 && (
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          Tomado por: {flight.takenBy.map(tb => tb.user.name).join(', ')}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        {flight.status === 'PROGRAMADO' && (
                          <button
                            onClick={() => handleStatusChange(flight.id, 'EMBARCANDO' as FlightStatus)}
                            disabled={updatingStatus === flight.id}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              opacity: updatingStatus === flight.id ? 0.6 : 1
                            }}
                          >
                            {updatingStatus === flight.id ? 'Actualizando...' : 'Iniciar Embarque'}
                          </button>
                        )}
                        {flight.status === 'EMBARCANDO' && (
                          <button
                            onClick={() => handleStatusChange(flight.id, 'EN_VUELO' as FlightStatus)}
                            disabled={updatingStatus === flight.id}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              opacity: updatingStatus === flight.id ? 0.6 : 1
                            }}
                          >
                            {updatingStatus === flight.id ? 'Actualizando...' : 'Iniciar Vuelo'}
                          </button>
                        )}
                        {isUser && !taken && (
                          <button
                            onClick={() => handleTakeFlight(flight.id)}
                            disabled={takingFlight === flight.id}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#8b5cf6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              opacity: takingFlight === flight.id ? 0.6 : 1
                            }}
                          >
                            {takingFlight === flight.id ? 'Tomando...' : 'Tomar Vuelo'}
                          </button>
                        )}
                        {isUser && taken && (
                          <>
                            <button
                              onClick={() => handleReleaseFlight(flight.id)}
                              disabled={takingFlight === flight.id}
                              style={{
                                padding: '0.5rem 1rem',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                opacity: takingFlight === flight.id ? 0.6 : 1
                              }}
                            >
                              {takingFlight === flight.id ? 'Liberando...' : 'Liberar'}
                            </button>
                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', alignSelf: 'center' }}>
                              ✓ EN CURSO
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

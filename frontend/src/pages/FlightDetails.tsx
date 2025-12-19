import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { flightService, userFlightService } from '../services/api'
import type { Flight } from '../types'

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [flight, setFlight] = useState<Flight | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTaken, setIsTaken] = useState(false)
  const [processingFlight, setProcessingFlight] = useState(false)

  useEffect(() => {
    if (id) {
      loadFlight()
      if (user?.role === 'USUARIO') {
        checkIfTaken()
      }
    }
  }, [id, user])

  const loadFlight = async () => {
    try {
      setLoading(true)
      const data = await flightService.getById(id!)
      setFlight(data)
    } catch (error: any) {
      console.error('Error loading flight:', error)
      if (error.response?.status === 404) {
        alert('Vuelo no encontrado')
        navigate('/flights')
      }
    } finally {
      setLoading(false)
    }
  }

  const checkIfTaken = async () => {
    try {
      const result = await userFlightService.checkFlightTaken(id!)
      setIsTaken(result.taken)
    } catch (error) {
      console.error('Error checking flight:', error)
    }
  }

  const handleTakeFlight = async () => {
    if (processingFlight || !id) return
    
    setProcessingFlight(true)
    try {
      await userFlightService.takeFlight(id)
      setIsTaken(true)
      alert('✅ Vuelo tomado correctamente')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al tomar el vuelo'
      alert(`❌ ${message}`)
    } finally {
      setProcessingFlight(false)
    }
  }

  const handleReleaseFlight = async () => {
    if (processingFlight || !id) return
    
    if (!confirm('¿Estás seguro de cancelar este vuelo?')) {
      return
    }
    
    setProcessingFlight(true)
    try {
      await userFlightService.releaseFlight(id)
      setIsTaken(false)
      alert('✅ Vuelo cancelado correctamente')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al cancelar el vuelo'
      alert(`❌ ${message}`)
    } finally {
      setProcessingFlight(false)
    }
  }

  // Función para calcular tiempo estimado basado en origen y destino
  const calculateEstimatedTime = (origin: string, destination: string): string => {
    // Distancias aproximadas entre países (en km) - Base de datos más completa
    const distances: Record<string, Record<string, number>> = {
      'España': {
        'México': 9000, 'Estados Unidos': 6000, 'Argentina': 10000, 'Colombia': 8000,
        'Francia': 1000, 'Reino Unido': 1200, 'Alemania': 1500, 'Italia': 1300,
        'Portugal': 500, 'Grecia': 2000, 'Turquía': 3000, 'Rusia': 3500
      },
      'Estados Unidos': {
        'España': 6000, 'México': 3000, 'Francia': 6000, 'Reino Unido': 5500,
        'Japón': 10000, 'China': 11000, 'Alemania': 6500, 'Canadá': 2000,
        'Brasil': 7500, 'Argentina': 8500
      },
      'México': {
        'España': 9000, 'Estados Unidos': 3000, 'Argentina': 7000, 'Colombia': 3000,
        'Brasil': 7500, 'Chile': 6000, 'Perú': 4000
      },
      'Francia': {
        'España': 1000, 'Reino Unido': 500, 'Alemania': 800, 'Italia': 1000,
        'Estados Unidos': 6000, 'Grecia': 2000, 'Rusia': 2500
      },
      'Alemania': {
        'Reino Unido': 900, 'España': 1500, 'Francia': 800, 'Estados Unidos': 6500,
        'Italia': 900, 'Grecia': 1800, 'Rusia': 2000
      },
      'Reino Unido': {
        'España': 1200, 'Francia': 500, 'Estados Unidos': 5500, 'Alemania': 900,
        'Italia': 1500, 'Grecia': 2500, 'Emiratos Árabes Unidos': 5500
      },
      'Argentina': {
        'España': 10000, 'México': 7000, 'Estados Unidos': 8500, 'Brasil': 2000,
        'Chile': 1100, 'Colombia': 4500
      },
      'Brasil': {
        'España': 8000, 'Estados Unidos': 7500, 'Argentina': 2000, 'Portugal': 7500,
        'Francia': 9000
      },
      'Japón': {
        'Estados Unidos': 10000, 'China': 2000, 'Corea del Sur': 1000,
        'Singapur': 5300, 'España': 11000
      },
      'China': {
        'Estados Unidos': 11000, 'Japón': 2000, 'España': 9500, 'Reino Unido': 8000,
        'Singapur': 3800, 'India': 3000
      }
    }

    // Buscar distancia directa o inversa
    let distance = distances[origin]?.[destination] || distances[destination]?.[origin]
    
    // Si no se encuentra, estimar basado en categorías de distancia
    if (!distance) {
      // Misma región (Europa)
      const europeCountries = ['España', 'Francia', 'Reino Unido', 'Alemania', 'Italia', 'Portugal', 'Grecia']
      const isBothEurope = europeCountries.includes(origin) && europeCountries.includes(destination)
      
      // Misma región (América)
      const americasCountries = ['Estados Unidos', 'México', 'Argentina', 'Brasil', 'Colombia', 'Chile', 'Canadá']
      const isBothAmericas = americasCountries.includes(origin) && americasCountries.includes(destination)
      
      // Misma región (Asia)
      const asiaCountries = ['Japón', 'China', 'Corea del Sur', 'Singapur', 'India', 'Tailandia']
      const isBothAsia = asiaCountries.includes(origin) && asiaCountries.includes(destination)
      
      if (isBothEurope) {
        distance = 1500 // Distancia promedio en Europa
      } else if (isBothAmericas) {
        distance = 4000 // Distancia promedio en América
      } else if (isBothAsia) {
        distance = 3000 // Distancia promedio en Asia
      } else {
        distance = 8000 // Distancia intercontinental promedio
      }
    }
    
    // Velocidad promedio de un avión comercial: ~900 km/h
    const speedKmh = 900
    const hours = distance / speedKmh
    
    // Redondear a horas y minutos
    const totalMinutes = Math.round(hours * 60)
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    
    if (h > 0 && m > 0) {
      return `${h}h ${m}m`
    } else if (h > 0) {
      return `${h}h`
    } else {
      return `${m}m`
    }
  }

  // Función para determinar el tipo de vuelo basado en serviceClass
  const getFlightType = (serviceClass: string): string => {
    const lowerClass = serviceClass.toLowerCase()
    
    if (lowerClass.includes('primera') || lowerClass.includes('first') || lowerClass.includes('1-2-1')) {
      return 'Primera Clase'
    } else if (lowerClass.includes('ejecutiva') || lowerClass.includes('business') || lowerClass.includes('ejecutivo') || lowerClass.includes('2-2')) {
      return 'Clase Ejecutiva'
    } else if (lowerClass.includes('premium') || lowerClass.includes('económica premium') || lowerClass.includes('economica premium') || lowerClass.includes('2-4-2')) {
      return 'Económico Premium'
    } else {
      return 'Económico'
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando detalles del vuelo...</div>
  }

  if (!flight) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Vuelo no encontrado</h2>
        <button onClick={() => navigate('/flights')}>Volver a Vuelos</button>
      </div>
    )
  }

  const estimatedTime = calculateEstimatedTime(flight.origin, flight.destination)
  const flightType = flight.plane ? getFlightType(flight.plane.serviceClass) : 'Económico'
  const capacity = flight.plane?.capacity || 0
  const takenSeats = flight.takenBy?.length || 0
  const availableSeats = capacity - takenSeats

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
        <h1 style={{ margin: 0 }}>✈️ Detalles del Vuelo</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button
            onClick={() => navigate('/flights')}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid white',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Volver a Vuelos
          </button>
          <span>{user?.name}</span>
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

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          {/* Información Principal */}
          <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '2rem', marginTop: 0, marginBottom: '1rem', color: '#1e3a8a' }}>
              {flight.origin} → {flight.destination}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <div style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Fecha</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{flight.date}</div>
              </div>
              <div>
                <div style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Hora de Salida</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{flight.time}</div>
              </div>
              <div>
                <div style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Estado</div>
                <span style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  background: flight.status === 'EN_VUELO' ? '#10b981' :
                               flight.status === 'PROGRAMADO' ? '#3b82f6' :
                               flight.status === 'CANCELADO' ? '#ef4444' : '#f59e0b',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>{flight.status}</span>
              </div>
            </div>
          </div>

          {/* Información del Tipo de Vuelo, Capacidad y Tiempo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Tipo de Vuelo */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Tipo de Vuelo</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{flightType}</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                {flight.plane?.serviceClass || 'Económica 3-3'}
              </div>
            </div>

            {/* Capacidad de Asientos */}
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Capacidad de Asientos</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{capacity} asientos</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                Disponibles: {availableSeats} | Ocupados: {takenSeats}
              </div>
            </div>

            {/* Tiempo Estimado */}
            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Tiempo Estimado</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{estimatedTime}</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                Duración aproximada del vuelo
              </div>
            </div>
          </div>

          {/* Información del Avión */}
          {flight.plane && (
            <div style={{
              background: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e3a8a' }}>Información del Avión</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ color: '#666', fontSize: '0.875rem' }}>Nombre</div>
                  <div style={{ fontWeight: 'bold' }}>{flight.plane.name}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.875rem' }}>Modelo</div>
                  <div style={{ fontWeight: 'bold' }}>{flight.plane.model}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.875rem' }}>Aerolínea</div>
                  <div style={{ fontWeight: 'bold' }}>{flight.plane.airline}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.875rem' }}>Estado del Avión</div>
                  <div style={{ fontWeight: 'bold' }}>{flight.plane.status}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tripulación */}
          {flight.crewMembers && flight.crewMembers.length > 0 && (
            <div style={{
              background: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e3a8a' }}>Tripulación</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {flight.crewMembers.map((member) => (
                  <div key={member.id} style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{member.name}</div>
                    <div style={{ color: '#666', fontSize: '0.875rem' }}>{member.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usuarios que tomaron el vuelo */}
          {flight.takenBy && flight.takenBy.length > 0 && (
            <div style={{
              background: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e3a8a' }}>
                Pasajeros ({flight.takenBy.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {flight.takenBy.map((userFlight) => (
                  <div key={userFlight.id} style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{userFlight.user.name}</div>
                    <div style={{ color: '#666', fontSize: '0.875rem' }}>{userFlight.user.email}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            {user?.role === 'USUARIO' && (
              <>
                {isTaken ? (
                  <button
                    onClick={handleReleaseFlight}
                    disabled={processingFlight}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: processingFlight ? '#9ca3af' : '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: processingFlight ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {processingFlight ? 'Cancelando...' : '❌ Cancelar Vuelo'}
                  </button>
                ) : (
                  <button
                    onClick={handleTakeFlight}
                    disabled={processingFlight}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: processingFlight ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: processingFlight ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {processingFlight ? 'Tomando...' : '✈️ Tomar este Vuelo'}
                  </button>
                )}
              </>
            )}
            {(user?.role === 'ADMIN' || user?.role === 'OPERADOR') && (
              <button
                onClick={() => navigate(`/flights/${flight.id}/edit`)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                Editar Vuelo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightDetails


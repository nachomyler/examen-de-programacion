import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { flightService, userFlightService } from '../services/api'
import type { Flight, FlightStatus } from '../types'

const Flights: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [takenFlights, setTakenFlights] = useState<Set<string>>(new Set())
  const [processingFlight, setProcessingFlight] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    status: '' as FlightStatus | ''
  })
  const [debouncedFilters, setDebouncedFilters] = useState({
    origin: '',
    destination: '',
    status: '' as FlightStatus | ''
  })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialLoadRef = useRef(true)

  // Lista de países disponibles para filtros y formularios
  const countries = [
    'España',
    'Estados Unidos',
    'México',
    'Argentina',
    'Colombia',
    'Chile',
    'Perú',
    'Brasil',
    'Francia',
    'Reino Unido',
    'Alemania',
    'Italia',
    'Países Bajos',
    'Bélgica',
    'Suiza',
    'Portugal',
    'Grecia',
    'Turquía',
    'Emiratos Árabes Unidos',
    'Qatar',
    'Arabia Saudí',
    'Japón',
    'China',
    'Corea del Sur',
    'Singapur',
    'Tailandia',
    'India',
    'Australia',
    'Nueva Zelanda',
    'Canadá',
    'República Dominicana',
    'Costa Rica',
    'Panamá',
    'Ecuador',
    'Venezuela',
    'Uruguay',
    'Paraguay',
    'Bolivia',
    'Guatemala',
    'Honduras',
    'El Salvador',
    'Nicaragua',
    'Cuba',
    'Jamaica',
    'Trinidad y Tobago',
    'Bahamas',
    'Barbados',
    'Rusia',
    'Polonia',
    'República Checa',
    'Hungría',
    'Rumania',
    'Bulgaria',
    'Croacia',
    'Serbia',
    'Eslovenia',
    'Austria',
    'Suecia',
    'Noruega',
    'Dinamarca',
    'Finlandia',
    'Irlanda',
    'Islandia',
    'Luxemburgo',
    'Mónaco',
    'Andorra',
    'Malta',
    'Chipre',
    'Marruecos',
    'Egipto',
    'Sudáfrica',
    'Kenia',
    'Nigeria',
    'Ghana',
    'Senegal',
    'Túnez',
    'Argelia',
    'Libia',
    'Etiopía',
    'Tanzania',
    'Uganda',
    'Ruanda',
    'Mauricio',
    'Seychelles',
    'Madagascar',
    'Mozambique',
    'Angola',
    'Zambia',
    'Zimbabue',
    'Botsuana',
    'Namibia'
  ]

  // Debounce para los filtros de texto (origen y destino)
  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Si es la carga inicial, aplicar inmediatamente
    if (isInitialLoadRef.current) {
      setDebouncedFilters(filters)
      isInitialLoadRef.current = false
      return
    }

    // Para cambios de origen o destino, usar debounce de 500ms
    const hasTextFilterChanged = filters.origin !== debouncedFilters.origin || filters.destination !== debouncedFilters.destination
    const hasStatusChanged = filters.status !== debouncedFilters.status

    if (hasTextFilterChanged) {
      setIsFiltering(true)
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedFilters(prev => ({
          ...prev,
          origin: filters.origin,
          destination: filters.destination
        }))
        setIsFiltering(false)
      }, 500)
    } else if (hasStatusChanged) {
      // Para cambios de estado, aplicar inmediatamente sin debounce
      setDebouncedFilters(prev => ({
        ...prev,
        status: filters.status
      }))
    }

    // Cleanup
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [filters.origin, filters.destination, filters.status])

  // Cargar vuelos cuando cambien los filtros con debounce
  useEffect(() => {
    loadFlights()
  }, [debouncedFilters.origin, debouncedFilters.destination, debouncedFilters.status])

  useEffect(() => {
    if (user?.role === 'USUARIO') {
      loadTakenFlights()
    }
  }, [user])

  const loadFlights = useCallback(async () => {
    try {
      // Solo mostrar loading en la carga inicial (cuando no hay vuelos cargados)
      const isInitialLoad = isInitialLoadRef.current
      if (isInitialLoad) {
        setLoading(true)
      }
      
      const params: any = {}
      // Solo agregar parámetros si tienen valor (no están vacíos)
      if (debouncedFilters.origin && debouncedFilters.origin.trim() !== '') {
        params.origin = debouncedFilters.origin.trim()
      }
      if (debouncedFilters.destination && debouncedFilters.destination.trim() !== '') {
        params.destination = debouncedFilters.destination.trim()
      }
      if (debouncedFilters.status) {
        params.status = debouncedFilters.status
      }
      
      const data = await flightService.getAll(params)
      // Filter out deleted flights and ensure we have valid data
      setFlights(Array.isArray(data) ? data.filter(f => !f.deletedAt) : [])
    } catch (error: any) {
      console.error('Error loading flights:', error)
      // Si es un error 401, el interceptor ya maneja la redirección
      if (error.response?.status !== 401) {
        // Set empty array on error instead of leaving undefined (except for auth errors)
        setFlights([])
      }
    } finally {
      setLoading(false)
      setIsFiltering(false)
    }
  }, [debouncedFilters.origin, debouncedFilters.destination, debouncedFilters.status])

  const loadTakenFlights = async () => {
    try {
      const myFlights = await userFlightService.getMyFlights()
      const takenIds = new Set(myFlights.map(f => String(f.id)))
      setTakenFlights(takenIds)
    } catch (error) {
      console.error('Error loading taken flights:', error)
    }
  }

  const handleTakeFlight = async (flightId: string) => {
    if (processingFlight) return
    
    setProcessingFlight(flightId)
    try {
      await userFlightService.takeFlight(flightId)
      setTakenFlights(prev => new Set(prev).add(flightId))
      alert('✅ Vuelo tomado correctamente')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al tomar el vuelo'
      alert(`❌ ${message}`)
    } finally {
      setProcessingFlight(null)
    }
  }

  const handleReleaseFlight = async (flightId: string) => {
    if (processingFlight) return
    
    if (!confirm('¿Estás seguro de cancelar este vuelo?')) {
      return
    }
    
    setProcessingFlight(flightId)
    try {
      await userFlightService.releaseFlight(flightId)
      setTakenFlights(prev => {
        const newSet = new Set(prev)
        newSet.delete(flightId)
        return newSet
      })
      alert('✅ Vuelo cancelado correctamente')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al cancelar el vuelo'
      alert(`❌ ${message}`)
    } finally {
      setProcessingFlight(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading && flights.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando vuelos...</div>
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
        <h1 style={{ margin: 0 }}>✈️ SkyTrack Airlines - Vuelos</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid white',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Panel de Estado de Vuelos
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
        {/* Filtros */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>
            Filtros
            {isFiltering && (
              <span style={{
                marginLeft: '1rem',
                fontSize: '0.875rem',
                color: '#3b82f6',
                fontWeight: 'normal'
              }}>
                Filtrando...
              </span>
            )}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Origen</label>
              <input
                type="text"
                list="filter-countries-origin"
                value={filters.origin}
                onChange={(e) => {
                  const value = e.target.value
                  setFilters(prev => ({ ...prev, origin: value }))
                }}
                onBlur={(e) => {
                  // Asegurar que el valor se actualiza cuando se pierde el foco
                  const value = e.target.value.trim()
                  if (value !== filters.origin) {
                    setFilters(prev => ({ ...prev, origin: value }))
                  }
                }}
                placeholder="Selecciona o escribe un país"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
              <datalist id="filter-countries-origin">
                {countries.map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Destino</label>
              <input
                type="text"
                list="filter-countries-destination"
                value={filters.destination}
                onChange={(e) => {
                  const value = e.target.value
                  setFilters(prev => ({ ...prev, destination: value }))
                }}
                onBlur={(e) => {
                  // Asegurar que el valor se actualiza cuando se pierde el foco
                  const value = e.target.value.trim()
                  if (value !== filters.destination) {
                    setFilters(prev => ({ ...prev, destination: value }))
                  }
                }}
                placeholder="Selecciona o escribe un país"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
              <datalist id="filter-countries-destination">
                {countries.map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Estado</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as FlightStatus | '' })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Todos</option>
                <option value="PROGRAMADO">Programado</option>
                <option value="EMBARCANDO">Embarcando</option>
                <option value="EN_VUELO">En Vuelo</option>
                <option value="ATERRIZADO">Aterrizado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => setFilters({ origin: '', destination: '', status: '' })}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Botón crear vuelo */}
        {(user?.role === 'ADMIN' || user?.role === 'OPERADOR') && (
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
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
              {showCreateForm ? 'Cancelar' : '+ Crear Nuevo Vuelo'}
            </button>
          </div>
        )}

        {/* Formulario crear vuelo */}
        {showCreateForm && (user?.role === 'ADMIN' || user?.role === 'OPERADOR') && (
          <FlightForm
            onSuccess={() => {
              setShowCreateForm(false)
              loadFlights()
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {flights.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2>No hay vuelos disponibles</h2>
            <p style={{ color: '#666' }}>No se encontraron vuelos en el sistema.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {flights.map((flight) => (
              <div key={flight.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {flight.origin} → {flight.destination}
                    {user?.role === 'USUARIO' && takenFlights.has(String(flight.id)) && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: '#10b981',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        ✓ TOMADO
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#666' }}>
                    Fecha: {flight.date} | Hora: {flight.time}
                  </div>
                  <div style={{ color: '#666', marginTop: '0.5rem' }}>
                    Estado: <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      background: flight.status === 'EN_VUELO' ? '#10b981' :
                                   flight.status === 'PROGRAMADO' ? '#3b82f6' :
                                   flight.status === 'CANCELADO' ? '#ef4444' : '#f59e0b',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>{flight.status}</span>
                  </div>
                  {flight.plane && (
                    <div style={{ color: '#666', marginTop: '0.5rem' }}>
                      Avión: {flight.plane.name} ({flight.plane.model})
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '150px' }}>
                  {/* Botones para Admin/Operador */}
                  {(user?.role === 'ADMIN' || user?.role === 'OPERADOR') && (
                    <>
                      <button
                        onClick={() => navigate(`/flights/${flight.id}/edit`)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Editar
                      </button>
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={async () => {
                            if (confirm('¿Está seguro de eliminar este vuelo?')) {
                              try {
                                await flightService.delete(flight.id)
                                loadFlights()
                              } catch (error) {
                                alert('Error al eliminar vuelo')
                              }
                            }
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          Eliminar
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Botones para Usuarios - Tomar/Cancelar Vuelo */}
                  {user?.role === 'USUARIO' && (
                    <>
                      {takenFlights.has(String(flight.id)) ? (
                        <button
                          onClick={() => handleReleaseFlight(flight.id)}
                          disabled={processingFlight === flight.id}
                          style={{
                            padding: '0.5rem 1rem',
                            background: processingFlight === flight.id ? '#9ca3af' : '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: processingFlight === flight.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {processingFlight === flight.id ? 'Cancelando...' : '❌ Cancelar Vuelo'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTakeFlight(flight.id)}
                          disabled={processingFlight === flight.id}
                          style={{
                            padding: '0.5rem 1rem',
                            background: processingFlight === flight.id ? '#9ca3af' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: processingFlight === flight.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {processingFlight === flight.id ? 'Tomando...' : '✈️ Tomar Vuelo'}
                        </button>
                      )}
                      {takenFlights.has(String(flight.id)) && (
                        <div style={{
                          padding: '0.25rem 0.5rem',
                          background: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}>
                          ✓ TOMADO
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Botón Ver Detalles (todos los usuarios) */}
                  <button
                    onClick={() => navigate(`/flights/${flight.id}`)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de formulario de vuelo (simplificado)
const FlightForm: React.FC<{ onSuccess: () => void; onCancel: () => void }> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    planeId: '',
    status: 'PROGRAMADO' as FlightStatus
  })
  const [planes, setPlanes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const countries = [
    'España',
    'Estados Unidos',
    'México',
    'Argentina',
    'Colombia',
    'Chile',
    'Perú',
    'Brasil',
    'Francia',
    'Reino Unido',
    'Alemania',
    'Italia',
    'Países Bajos',
    'Bélgica',
    'Suiza',
    'Portugal',
    'Grecia',
    'Turquía',
    'Emiratos Árabes Unidos',
    'Qatar',
    'Arabia Saudí',
    'Japón',
    'China',
    'Corea del Sur',
    'Singapur',
    'Tailandia',
    'India',
    'Australia',
    'Nueva Zelanda',
    'Canadá',
    'República Dominicana',
    'Costa Rica',
    'Panamá',
    'Ecuador',
    'Venezuela',
    'Uruguay',
    'Paraguay',
    'Bolivia',
    'Guatemala',
    'Honduras',
    'El Salvador',
    'Nicaragua',
    'Cuba',
    'Jamaica',
    'Trinidad y Tobago',
    'Bahamas',
    'Barbados',
    'Rusia',
    'Polonia',
    'República Checa',
    'Hungría',
    'Rumania',
    'Bulgaria',
    'Croacia',
    'Serbia',
    'Eslovenia',
    'Austria',
    'Suecia',
    'Noruega',
    'Dinamarca',
    'Finlandia',
    'Irlanda',
    'Islandia',
    'Luxemburgo',
    'Mónaco',
    'Andorra',
    'Malta',
    'Chipre',
    'Marruecos',
    'Egipto',
    'Sudáfrica',
    'Kenia',
    'Nigeria',
    'Ghana',
    'Senegal',
    'Túnez',
    'Argelia',
    'Libia',
    'Etiopía',
    'Tanzania',
    'Uganda',
    'Ruanda',
    'Mauricio',
    'Seychelles',
    'Madagascar',
    'Mozambique',
    'Angola',
    'Zambia',
    'Zimbabue',
    'Botsuana',
    'Namibia'
  ]

  useEffect(() => {
    loadPlanes()
  }, [])

  const loadPlanes = async () => {
    try {
      const { planeService } = await import('../services/api')
      const data = await planeService.getAll()
      setPlanes(data.filter(p => p.status === 'DISPONIBLE'))
    } catch (error) {
      console.error('Error loading planes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await flightService.create({
        ...formData,
        planeId: formData.planeId
      })
      onSuccess()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear vuelo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginTop: 0 }}>Crear Nuevo Vuelo</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Origen *</label>
            <input
              type="text"
              list="countries-origin"
              required
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="Selecciona o escribe un país"
              style={{ width: '100%', padding: '0.5rem', border: '2px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }}
            />
            <datalist id="countries-origin">
              {countries.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Destino *</label>
            <input
              type="text"
              list="countries-destination"
              required
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="Selecciona o escribe un país"
              style={{ width: '100%', padding: '0.5rem', border: '2px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }}
            />
            <datalist id="countries-destination">
              {countries.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fecha *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '2px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hora *</label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '2px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Avión *</label>
            <select
              required
              value={formData.planeId}
              onChange={(e) => setFormData({ ...formData, planeId: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '2px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }}
            >
              <option value="">Seleccionar avión</option>
              {planes.map(plane => (
                <option key={plane.id} value={plane.id}>
                  {plane.name} - {plane.model} (Capacidad: {plane.capacity})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Estado</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as FlightStatus })}
              style={{ width: '100%', padding: '0.5rem', border: '2px solid #e5e7eb', borderRadius: '8px', boxSizing: 'border-box' }}
            >
              <option value="PROGRAMADO">Programado</option>
              <option value="EMBARCANDO">Embarcando</option>
              <option value="EN_VUELO">En Vuelo</option>
              <option value="ATERRIZADO">Aterrizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Creando...' : 'Crear Vuelo'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Flights

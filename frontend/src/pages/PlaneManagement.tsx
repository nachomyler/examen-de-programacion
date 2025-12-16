import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { planeService, flightService, crewService } from '../services/api'
import type { Plane, PlaneStatus, Flight, CrewMember, CrewRole } from '../types'
import CrewModal from '../components/CrewModal'

const PlaneManagement: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [planes, setPlanes] = useState<Plane[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPlane, setEditingPlane] = useState<Plane | null>(null)
  const [selectedFlightForCrew, setSelectedFlightForCrew] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    capacity: '',
    status: 'DISPONIBLE' as PlaneStatus,
    type: 'ECONOMICO',
    airline: 'SkyTrack Airlines',
    serviceClass: 'Económica 3-3'
  })

  const airlines = [
    'SkyTrack Airlines',
    'American Airlines',
    'Delta Air Lines',
    'United Airlines',
    'Lufthansa',
    'British Airways',
    'Air France',
    'Emirates',
    'Qatar Airways',
    'Singapore Airlines',
    'Japan Airlines',
    'Cathay Pacific',
    'KLM',
    'Turkish Airlines',
    'Aeroméxico',
    'LATAM Airlines'
  ]

  const serviceClasses = [
    'Económica 3-3',
    'Económica 3-4-3',
    'Business 2-2',
    'Business 1-2-1',
    'Primera 1-2-1',
    'Primera 1-1',
    'Premium Economy 2-4-2',
    'Económica 2-4-2',
    'Business 2-4-2',
    'Mixta (Business + Económica)'
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [planesData, flightsData] = await Promise.all([
        planeService.getAll(),
        flightService.getAll()
      ])
      setPlanes(Array.isArray(planesData) ? planesData.map(p => ({ ...p, id: String(p.id) })) : [])
      setFlights(Array.isArray(flightsData) ? flightsData.filter(f => !f.deletedAt).map(f => ({
        ...f,
        id: String(f.id),
        planeId: String(f.planeId),
        crewMembers: f.crewMembers ? f.crewMembers.map(c => ({
          ...c,
          id: String(c.id),
          flightId: String(c.flightId)
        })) : []
      })) : [])
    } catch (error: any) {
      console.error('Error loading data:', error)
      if (error.response?.status !== 401) {
        setPlanes([])
        setFlights([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (plane?: Plane) => {
    if (plane) {
      setEditingPlane(plane)
      setFormData({
        name: plane.name || '',
        model: plane.model || '',
        capacity: String(plane.capacity || ''),
        status: plane.status || 'DISPONIBLE',
        type: plane.type || 'ECONOMICO',
        airline: plane.airline || 'SkyTrack Airlines',
        serviceClass: plane.serviceClass || 'Económica 3-3'
      })
    } else {
      setEditingPlane(null)
      setFormData({
        name: '',
        model: '',
        capacity: '',
        status: 'DISPONIBLE',
        type: 'ECONOMICO',
        airline: 'SkyTrack Airlines',
        serviceClass: 'Económica 3-3'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPlane(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingPlane) {
        await planeService.update(editingPlane.id, formData)
      } else {
        await planeService.create(formData)
      }
      handleCloseModal()
      await loadData()
    } catch (error: any) {
      console.error('Error saving plane:', error)
      alert(error.response?.data?.error || 'Error al guardar el avión')
    }
  }

  const handleAssignToFlight = async (planeId: string, flightId: string) => {
    try {
      await flightService.update(flightId, { planeId })
      alert('Avión asignado al vuelo exitosamente')
      await loadData()
    } catch (error: any) {
      console.error('Error assigning plane:', error)
      alert(error.response?.data?.error || 'Error al asignar el avión')
    }
  }

  const handleManageCrew = (flightId: string) => {
    setSelectedFlightForCrew(flightId)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return { bg: '#d1fae5', color: '#065f46' }
      case 'EN_VUELO':
        return { bg: '#dbeafe', color: '#1e40af' }
      case 'EN_MANTENIMIENTO':
        return { bg: '#fef3c7', color: '#92400e' }
      default:
        return { bg: '#f3f4f6', color: '#666' }
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando aviones...</div>
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
        <h1 style={{ margin: 0 }}>✈️ SkyTrack Airlines - Gestión de Aviones</h1>
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
            Vuelos
          </button>
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

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#1e3a8a' }}>Lista de Aviones</h2>
          <button
            onClick={() => handleOpenModal()}
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
            + Crear Avión
          </button>
        </div>

        {planes.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>No hay aviones registrados</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {planes.map((plane) => {
              const planeFlights = flights.filter(f => f.planeId === plane.id)
              const statusColors = getStatusColor(plane.status)
              return (
                <div
                  key={plane.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#1e3a8a' }}>
                        {plane.name} - {plane.model}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        <div style={{ color: '#666' }}>
                          <strong>Capacidad:</strong> {plane.capacity} pasajeros
                        </div>
                        <div style={{ color: '#666' }}>
                          <strong>Tipo:</strong> {plane.type === 'PRIVADO' ? 'Privado' : 'Económico'}
                        </div>
                        <div style={{ color: '#666' }}>
                          <strong>Aerolínea:</strong> {plane.airline}
                        </div>
                        <div style={{ color: '#666' }}>
                          <strong>Clase de Servicio:</strong> {plane.serviceClass}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        background: statusColors.bg,
                        color: statusColors.color
                      }}>
                        {plane.status === 'DISPONIBLE' ? 'Disponible' : 
                         plane.status === 'EN_VUELO' ? 'En Vuelo' : 
                         'En Mantenimiento'}
                      </span>
                      <button
                        onClick={() => handleOpenModal(plane)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>

                  {planeFlights.length > 0 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <h4 style={{ margin: 0, marginBottom: '0.75rem', color: '#1e3a8a', fontSize: '1rem' }}>
                        Vuelos Asignados ({planeFlights.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {planeFlights.map((flight) => (
                          <div
                            key={flight.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.75rem',
                              background: '#f9fafb',
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 'bold' }}>
                                {flight.origin} → {flight.destination}
                              </div>
                              <div style={{ color: '#666', fontSize: '0.875rem' }}>
                                {flight.date} a las {flight.time} | Estado: {flight.status}
                              </div>
                              {flight.crewMembers && flight.crewMembers.length > 0 && (
                                <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                  Tripulación: {flight.crewMembers.map(c => c.name).join(', ')}
                                </div>
                              )}
                            </div>
                            {(user?.role === 'OPERADOR' || user?.role === 'ADMIN') && (
                              <button
                                onClick={() => handleManageCrew(flight.id)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: '#8b5cf6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                              >
                                Gestionar Tripulación
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {flights.length > 0 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <h4 style={{ margin: 0, marginBottom: '0.75rem', color: '#1e3a8a', fontSize: '1rem' }}>
                        Asignar a Vuelo
                      </h4>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignToFlight(plane.id, e.target.value)
                            e.target.value = ''
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">Seleccionar vuelo...</option>
                        {flights
                          .filter(f => f.planeId !== plane.id)
                          .map((flight) => (
                            <option key={flight.id} value={flight.id}>
                              {flight.origin} → {flight.destination} ({flight.date} {flight.time})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal para crear/editar avión */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#1e3a8a' }}>
                {editingPlane ? 'Editar Avión' : 'Crear Avión'}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Nombre:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Modelo:
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Capacidad:
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                  min="1"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Tipo:
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="ECONOMICO">Económico</option>
                  <option value="PRIVADO">Privado</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Aerolínea:
                </label>
                <input
                  type="text"
                  list="airlines"
                  value={formData.airline}
                  onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
                <datalist id="airlines">
                  {airlines.map((airline) => (
                    <option key={airline} value={airline} />
                  ))}
                </datalist>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Clase de Servicio:
                </label>
                <input
                  type="text"
                  list="serviceClasses"
                  value={formData.serviceClass}
                  onChange={(e) => setFormData({ ...formData, serviceClass: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
                <datalist id="serviceClasses">
                  {serviceClasses.map((serviceClass) => (
                    <option key={serviceClass} value={serviceClass} />
                  ))}
                </datalist>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Estado:
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PlaneStatus })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="EN_VUELO">En Vuelo</option>
                  <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#e5e7eb',
                    color: '#666',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {editingPlane ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de gestión de tripulación */}
      {selectedFlightForCrew && (
        <CrewModal
          flightId={selectedFlightForCrew}
          onClose={() => setSelectedFlightForCrew(null)}
          onUpdate={loadData}
        />
      )}
    </div>
  )
}

export default PlaneManagement


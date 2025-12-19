import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { flightService } from '../services/api'
import type { Flight, FlightStatus } from '../types'

const EditFlight: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [flight, setFlight] = useState<Flight | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    status: 'PROGRAMADO' as FlightStatus
  })

  // Lista de países disponibles
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
    if (id) {
      loadFlight()
    }
  }, [id])

  const loadFlight = async () => {
    try {
      setLoading(true)
      const data = await flightService.getById(id!)
      setFlight(data)
      // Formatear la fecha para el input type="date" (YYYY-MM-DD)
      let formattedDate = data.date
      
      // Si la fecha está en formato DD/MM/YYYY, convertir a YYYY-MM-DD
      const datePartsSlash = data.date.split('/')
      if (datePartsSlash.length === 3) {
        formattedDate = `${datePartsSlash[2]}-${datePartsSlash[1].padStart(2, '0')}-${datePartsSlash[0].padStart(2, '0')}`
      } else {
        // Si ya está en formato YYYY-MM-DD, usarla directamente
        const datePartsDash = data.date.split('-')
        if (datePartsDash.length === 3 && datePartsDash[0].length === 4) {
          formattedDate = data.date
        }
      }
      
      setFormData({
        origin: data.origin,
        destination: data.destination,
        date: formattedDate,
        time: data.time,
        status: data.status as FlightStatus
      })
    } catch (error: any) {
      console.error('Error loading flight:', error)
      if (error.response?.status === 404) {
        alert('Vuelo no encontrado')
        navigate('/flights')
      } else {
        alert('Error al cargar el vuelo')
        navigate('/flights')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.origin || !formData.destination || !formData.date || !formData.time) {
      alert('Por favor, completa todos los campos requeridos')
      return
    }

    setSaving(true)
    try {
      // El backend acepta el formato YYYY-MM-DD directamente según el seed
      // Mantener el formato YYYY-MM-DD que es el estándar
      const formattedDate = formData.date

      await flightService.update(id!, {
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        date: formattedDate,
        time: formData.time,
        status: formData.status
      })
      
      alert('✅ Vuelo actualizado correctamente')
      navigate(`/flights/${id}`)
    } catch (error: any) {
      console.error('Error updating flight:', error)
      const message = error.response?.data?.error || 'Error al actualizar el vuelo'
      alert(`❌ ${message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Cargando información del vuelo...
      </div>
    )
  }

  if (!flight) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Vuelo no encontrado</h2>
        <button onClick={() => navigate('/flights')}>Volver a Vuelos</button>
      </div>
    )
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
        <h1 style={{ margin: 0 }}>✈️ Editar Vuelo</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button
            onClick={() => navigate(`/flights/${id}`)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid white',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Volver a Detalles
          </button>
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
            Ver Todos los Vuelos
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

      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e3a8a' }}>
            Editar Vuelo: {flight.origin} → {flight.destination}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Origen */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                  Origen *
                </label>
                <input
                  type="text"
                  list="edit-countries-origin"
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Selecciona o escribe un país"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    fontSize: '1rem'
                  }}
                />
                <datalist id="edit-countries-origin">
                  {countries.map((country) => (
                    <option key={country} value={country} />
                  ))}
                </datalist>
              </div>

              {/* Destino */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                  Destino *
                </label>
                <input
                  type="text"
                  list="edit-countries-destination"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="Selecciona o escribe un país"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    fontSize: '1rem'
                  }}
                />
                <datalist id="edit-countries-destination">
                  {countries.map((country) => (
                    <option key={country} value={country} />
                  ))}
                </datalist>
              </div>

              {/* Fecha y Hora */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                    Hora *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Estado */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                  Estado *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as FlightStatus })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  <option value="PROGRAMADO">Programado</option>
                  <option value="EMBARCANDO">Embarcando</option>
                  <option value="EN_VUELO">En Vuelo</option>
                  <option value="ATERRIZADO">Aterrizado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              {/* Información del avión (solo lectura) */}
              {flight.plane && (
                <div style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Avión asignado (no editable)
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                    {flight.plane.name} - {flight.plane.model}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Capacidad: {flight.plane.capacity} asientos
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate(`/flights/${id}`)}
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  opacity: saving ? 0.6 : 1
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: saving ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {saving ? 'Guardando...' : '💾 Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditFlight


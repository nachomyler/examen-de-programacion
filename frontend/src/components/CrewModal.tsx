import React, { useEffect, useState } from 'react'
import { crewService } from '../services/api'
import type { CrewMember, CrewRole } from '../types'

interface CrewModalProps {
  flightId: string | null
  onClose: () => void
  onUpdate: () => void
}

const CrewModal: React.FC<CrewModalProps> = ({ flightId, onClose, onUpdate }) => {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCrew, setNewCrew] = useState({ name: '', role: 'PILOTO' as CrewRole })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (flightId) {
      loadCrew()
    }
  }, [flightId])

  const loadCrew = async () => {
    if (!flightId) return
    try {
      setLoading(true)
      const data = await crewService.getByFlight(flightId)
      setCrewMembers(Array.isArray(data) ? data.map(c => ({ ...c, id: String(c.id), flightId: String(c.flightId) })) : [])
    } catch (error) {
      console.error('Error loading crew:', error)
      setCrewMembers([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddCrew = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!flightId || !newCrew.name.trim()) return

    try {
      await crewService.addToFlight(flightId, {
        name: newCrew.name,
        role: newCrew.role
      })
      setNewCrew({ name: '', role: 'PILOTO' })
      setShowAddForm(false)
      await loadCrew()
      onUpdate()
    } catch (error: any) {
      console.error('Error adding crew:', error)
      alert(error.response?.data?.error || 'Error al agregar tripulante')
    }
  }

  const handleDeleteCrew = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este tripulante?')) return

    try {
      setDeletingId(id)
      await crewService.delete(id)
      await loadCrew()
      onUpdate()
    } catch (error: any) {
      console.error('Error deleting crew:', error)
      alert(error.response?.data?.error || 'Error al eliminar tripulante')
    } finally {
      setDeletingId(null)
    }
  }

  if (!flightId) return null

  return (
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
          <h2 style={{ margin: 0, color: '#1e3a8a' }}>Gestión de Tripulación</h2>
          <button
            onClick={onClose}
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {showAddForm ? 'Cancelar' : '+ Agregar Tripulante'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddCrew} style={{
                background: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Nombre:
                  </label>
                  <input
                    type="text"
                    value={newCrew.name}
                    onChange={(e) => setNewCrew({ ...newCrew, name: e.target.value })}
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
                    Rol:
                  </label>
                  <select
                    value={newCrew.role}
                    onChange={(e) => setNewCrew({ ...newCrew, role: e.target.value as CrewRole })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="PILOTO">Piloto</option>
                    <option value="COPILOTO">Copiloto</option>
                    <option value="AUXILIAR">Auxiliar</option>
                  </select>
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Agregar
                </button>
              </form>
            )}

            <div>
              <h3 style={{ marginBottom: '1rem', color: '#1e3a8a' }}>Tripulación Asignada</h3>
              {crewMembers.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                  No hay tripulación asignada
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {crewMembers.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {member.name}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.875rem' }}>
                          {member.role === 'PILOTO' ? 'Piloto' : member.role === 'COPILOTO' ? 'Copiloto' : 'Auxiliar'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCrew(member.id)}
                        disabled={deletingId === member.id}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          opacity: deletingId === member.id ? 0.6 : 1
                        }}
                      >
                        {deletingId === member.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CrewModal


'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const API_BASE_URL = 'https://vinilos-backend-2cwk.onrender.com'

interface Piercing {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export default function PiercingsAdminPage() {
  const [piercings, setPiercings] = useState<Piercing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPiercing, setEditingPiercing] = useState<Piercing | null>(null)

  useEffect(() => {
    fetchPiercings()
  }, [])

  const fetchPiercings = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/api/piercs/piercings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch piercings')
      const data = await response.json()
      setPiercings(data)
    } catch (err) {
      setError('Error al cargar los piercings')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (piercing: Piercing) => {
    setEditingPiercing(piercing)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingPiercing) return

    try {
      const token = localStorage.getItem('authToken')
      const formData = new FormData(e.currentTarget)
      const response = await fetch(`${API_BASE_URL}/api/piercs/piercings/${editingPiercing.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to update piercing')
      fetchPiercings()
      setEditingPiercing(null)
    } catch (err) {
      setError('Error al actualizar el piercing')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este piercing?')) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/api/piercs/piercings/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to delete piercing')
      fetchPiercings()
    } catch (err) {
      setError('Error al eliminar el piercing')
    }
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('authToken')
      const formData = new FormData(e.currentTarget)
      const response = await fetch(`${API_BASE_URL}/api/piercs/piercings/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to add piercing')
      fetchPiercings()
      e.currentTarget.reset()
    } catch (err) {
      setError('Error al añadir el piercing')
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Administrar Piercings</h1>
      
      <form onSubmit={handleAdd} className="mb-8 p-4 bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Añadir Nuevo Piercing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Nombre" required className="p-2 border rounded" />
          <input name="description" placeholder="Descripción" required className="p-2 border rounded" />
          <input name="price" type="number" placeholder="Precio" required className="p-2 border rounded" />
          <input name="image" type="file" accept="image/*" required className="p-2 border rounded" />
        </div>
        <button type="submit" className="mt-4 bg-green-500 text-white p-2 rounded">Añadir Piercing</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {piercings.map(piercing => (
          <div key={piercing.id} className="bg-white p-4 shadow rounded">
            {editingPiercing?.id === piercing.id ? (
              <form onSubmit={handleSave}>
                <input name="name" defaultValue={piercing.name} required className="w-full p-2 mb-2 border rounded" />
                <input name="description" defaultValue={piercing.description} required className="w-full p-2 mb-2 border rounded" />
                <input name="price" type="number" defaultValue={piercing.price} required className="w-full p-2 mb-2 border rounded" />
                <input name="image" type="file" accept="image/*" className="w-full p-2 mb-2 border rounded" />
                <div className="flex justify-between">
                  <button type="submit" className="bg-green-500 text-white p-2 rounded">Guardar</button>
                  <button type="button" onClick={() => setEditingPiercing(null)} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
                </div>
              </form>
            ) : (
              <>
                <Image src={`data:image/jpeg;base64,${piercing.image}`} alt={piercing.name} width={200} height={200} className="w-full h-48 object-cover mb-2 rounded" />
                <h3 className="font-bold">{piercing.name}</h3>
                <p>{piercing.description}</p>
                <p className="font-semibold">${piercing.price}</p>
                <div className="flex justify-between mt-2">
                  <button onClick={() => handleEdit(piercing)} className="bg-blue-500 text-white p-2 rounded">Editar</button>
                  <button onClick={() => handleDelete(piercing.id)} className="bg-red-500 text-white p-2 rounded">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

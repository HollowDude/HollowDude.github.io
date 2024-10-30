'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const API_BASE_URL = 'https://vinilos-backend-2cwk.onrender.com'

interface Tattoo {
  id: number
  name: string
  description: string
  image: string
  date: string
}

export default function TattoosAdminPage() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTattoo, setEditingTattoo] = useState<Tattoo | null>(null)

  useEffect(() =>   {
    fetchTattoos()
  }, [])

  const fetchTattoos = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch tattoos')
      const data = await response.json()
      setTattoos(data)
    } catch (err) {
      setError('Error al cargar los tatuajes')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (tattoo: Tattoo) => {
    setEditingTattoo(tattoo)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTattoo) return

    try {
      const token = localStorage.getItem('authToken')
      const formData = new FormData(e.currentTarget)
      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/${editingTattoo.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to update tattoo')
      fetchTattoos()
      setEditingTattoo(null)
    } catch (err) {
      setError('Error al actualizar el tatuaje')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tatuaje?')) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to delete tattoo')
      fetchTattoos()
    } catch (err) {
      setError('Error al eliminar el tatuaje')
    }
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('authToken')
      const formData = new FormData(e.currentTarget)
      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to add tattoo')
      fetchTattoos()
      e.currentTarget.reset()
    } catch (err) {
      setError('Error al añadir el tatuaje')
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Administrar Tatuajes</h1>
      
      <form onSubmit={handleAdd} className="mb-8 p-4 bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Añadir Nuevo Tatuaje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Nombre" required className="p-2 border rounded" />
          <input name="description" placeholder="Descripción" required className="p-2 border rounded" />
          <input name="date" type="date" required className="p-2 border rounded" />
          <input name="image" type="file" accept="image/*" required className="p-2 border rounded" />
        </div>
        <button type="submit" className="mt-4 bg-green-500 text-white p-2 rounded">Añadir Tatuaje</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tattoos.map(tattoo => (
          <div key={tattoo.id} className="bg-white p-4 shadow rounded">
            {editingTattoo?.id === tattoo.id ? (
              <form onSubmit={handleSave}>
                <input name="name" defaultValue={tattoo.name} required className="w-full p-2 mb-2 border rounded" />
                <input name="description" defaultValue={tattoo.description} required className="w-full p-2 mb-2 border rounded" />
                <input name="date" type="date" defaultValue={tattoo.date} required className="w-full p-2 mb-2 border rounded" />
                <input name="image" type="file" accept="image/*" className="w-full p-2 mb-2 border rounded" />
                <div className="flex justify-between">
                  <button type="submit" className="bg-green-500 text-white p-2 rounded">Guardar</button>
                  <button type="button" onClick={() => setEditingTattoo(null)} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
                </div>
              </form>
            ) : (
              <>
                <Image src={`data:image/jpeg;base64,${tattoo.image}`} alt={tattoo.name} width={200} height={200} className="w-full h-48 object-cover mb-2 rounded" />
                <h3 className="font-bold">{tattoo.name}</h3>
                <p>{tattoo.description}</p>
                <p className="text-sm text-gray-500">{new Date(tattoo.date).toLocaleDateString()}</p>
                <div className="flex justify-between mt-2">
                  <button onClick={() => handleEdit(tattoo)} className="bg-blue-500 text-white p-2 rounded">Editar</button>
                  <button onClick={() => handleDelete(tattoo.id)} className="bg-red-500 text-white p-2 rounded">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

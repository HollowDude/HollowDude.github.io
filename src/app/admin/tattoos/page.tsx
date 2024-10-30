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

  useEffect(() => {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los tatuajes'
      setError(errorMessage)
      console.error('Error fetching tattoos:', error)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el tatuaje'
      setError(errorMessage)
      console.error('Error updating tattoo:', error)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el tatuaje'
      setError(errorMessage)
      console.error('Error deleting tattoo:', error)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al añadir el tatuaje'
      setError(errorMessage)
      console.error('Error adding tattoo:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Administrar Tatuajes</h1>
      
      <form onSubmit={handleAdd} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Añadir Nuevo Tatuaje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Nombre"
            required
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="description"
            placeholder="Descripción"
            required
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="date"
            type="date"
            required
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="image"
            type="file"
            accept="image/*"
            required
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Añadir Tatuaje
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tattoos.map((tattoo) => (
          <div key={tattoo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {editingTattoo?.id === tattoo.id ? (
              <form onSubmit={handleSave} className="p-4">
                <input
                  name="name"
                  defaultValue={tattoo.name}
                  required
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  name="description"
                  defaultValue={tattoo.description}
                  required
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  name="date"
                  type="date"
                  defaultValue={tattoo.date}
                  required
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full p-2 mb-2 border rounded"
                />
                <div className="flex justify-between gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTattoo(null)}
                    className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="relative h-48 w-full">
                  <Image
                    src={`data:image/jpeg;base64,${tattoo.image}`}
                    alt={tattoo.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{tattoo.name}</h3>
                  <p className="text-gray-600 mb-2">{tattoo.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{new Date(tattoo.date).toLocaleDateString()}</p>
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(tattoo)}
                      className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(tattoo.id)}
                      className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

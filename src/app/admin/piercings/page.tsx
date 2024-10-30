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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los piercings'
      setError(errorMessage)
      console.error('Error fetching piercings:', error)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el piercing'
      setError(errorMessage)
      console.error('Error updating piercing:', error)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el piercing'
      setError(errorMessage)
      console.error('Error deleting piercing:', error)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al añadir el piercing'
      setError(errorMessage)
      console.error('Error adding piercing:', error)
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
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Administrar Piercings</h1>
      
      <form onSubmit={handleAdd} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Añadir Nuevo Piercing</h2>
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
            name="price"
            type="number"
            placeholder="Precio"
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
          Añadir Piercing
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {piercings.map((piercing) => (
          <div key={piercing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {editingPiercing?.id === piercing.id ? (
              <form onSubmit={handleSave} className="p-4">
                <input
                  name="name"
                  defaultValue={piercing.name}
                  required
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  name="description"
                  defaultValue={piercing.description}
                  required
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  name="price"
                  type="number"
                  defaultValue={piercing.price}
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
                    onClick={() => setEditingPiercing(null)}
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
                    src={`data:image/jpeg;base64,${piercing.image}`}
                    alt={piercing.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{piercing.name}</h3>
                  <p className="text-gray-600 mb-2">{piercing.description}</p>
                  <p className="font-semibold text-purple-600 mb-4">${piercing.price}</p>
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(piercing)}
                      className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(piercing.id)}
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

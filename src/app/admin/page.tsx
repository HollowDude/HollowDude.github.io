'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaRing, FaPencilAlt, FaUser } from 'react-icons/fa'

const API_BASE_URL = 'https://vinilos-backend-2cwk.onrender.com'

export default function AdminDashboard() {
  const [username, setUsername] = useState<string | null>(null)
  const [piercingsCount, setPiercingsCount] = useState<number | null>(null)
  const [tattoosCount, setTattoosCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        // Fetch user info
        const userResponse = await fetch(`${API_BASE_URL}/auth/user/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (!userResponse.ok) throw new Error('Failed to fetch user info')
        const userData = await userResponse.json()
        setUsername(userData.username)

        // Fetch piercings count
        const piercingsResponse = await fetch(`${API_BASE_URL}/api/piercs/piercings/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (!piercingsResponse.ok) throw new Error('Failed to fetch piercings')
        const piercingsData = await piercingsResponse.json()
        setPiercingsCount(piercingsData.length)

        // Fetch tattoos count
        const tattoosResponse = await fetch(`${API_BASE_URL}/api/tatts/tattoos/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (!tattoosResponse.ok) throw new Error('Failed to fetch tattoos')
        const tattoosData = await tattoosResponse.json()
        setTattoosCount(tattoosData.length)

      } catch (err) {
        console.error(err)
        setError('Error al cargar los datos del dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Dashboard de Administración</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaUser className="text-purple-500 text-2xl mr-2" />
          <h2 className="text-xl font-semibold">Bienvenido, {username}!</h2>
        </div>
        <p className="text-gray-600">Aquí puedes gestionar los piercings y tatuajes de la tienda.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link href="/admin/piercings" className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-800">Piercings</h2>
            <FaRing className="text-purple-500 text-3xl" />
          </div>
          <p className="text-gray-600 mb-2">Total de piercings: {piercingsCount}</p>
          <p className="text-purple-600 font-semibold">Gestionar piercings →</p>
        </Link>

        <Link href="/admin/tattoos" className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-800">Tatuajes</h2>
            <FaPencilAlt className="text-purple-500 text-3xl" />
          </div>
          <p className="text-gray-600 mb-2">Total de tatuajes: {tattoosCount}</p>
          <p className="text-purple-600 font-semibold">Gestionar tatuajes →</p>
        </Link>
      </div>
    </div>
  )
}

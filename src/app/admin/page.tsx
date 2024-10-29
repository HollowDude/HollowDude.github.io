'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    console.log('Admin page token check:', token)
    
    if (!token) {
      console.log('No token found, redirecting to login...')
      router.replace('/login')
      return
    }

    // Verificar el token con el backend
    const verifyToken = async () => {
      try {
        const response = await fetch('https://vinilos-backend-2cwk.onrender.com/auth/verify/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          console.log('Token verification failed, redirecting to login...')
          localStorage.removeItem('authToken')
          router.replace('/login')
        }
      } catch (error) {
        console.error('Token verification error:', error)
        localStorage.removeItem('authToken')
        router.replace('/login')
      }
    }

    verifyToken()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Panel de Administración</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Piercings</h2>
            <p className="text-gray-200 mb-4">Administra el catálogo de piercings</p>
            <button
              onClick={() => router.push('/admin/piercings')}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Gestionar Piercings
            </button>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Tatuajes</h2>
            <p className="text-gray-200 mb-4">Administra el catálogo de tatuajes</p>
            <button
              onClick={() => router.push('/admin/tattoos')}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Gestionar Tatuajes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

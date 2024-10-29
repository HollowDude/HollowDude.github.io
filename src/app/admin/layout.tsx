'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminPanel from '@/components/AdminPanel'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch('https://vinilos-backend-2cwk.onrender.com/auth/verify/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('authToken')
          router.push('/login')
        }
      } catch (error) {
        console.error('Error verifying auth:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <AdminPanel />
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  )
}

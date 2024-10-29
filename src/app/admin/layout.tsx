'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminPanel from '@/components/component/AdminPanel'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Evitar verificaciones múltiples
    if (isAuthenticated !== null) return;

    const checkAuth = () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true'
      console.log('Checking auth state:', isAuth)
      
      if (!isAuth && pathname !== '/login') {
        console.log('Not authenticated, redirecting to login')
        router.push('/login')
        return
      }
      
      setIsAuthenticated(isAuth)
    }

    checkAuth()
  }, [isAuthenticated, router, pathname])

  // Mostrar nada mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (la redirección ya se habrá iniciado)
  if (!isAuthenticated) {
    return null
  }

  // Si está autenticado, mostrar el layout
  return (
    <div className="flex min-h-screen">
      <AdminPanel />
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  )
}

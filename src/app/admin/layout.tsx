'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaRing, FaPencilAlt, FaSignOutAlt } from 'react-icons/fa'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    router.push('/login')
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-purple-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <ul className="space-y-4">
          <li>
            <Link href="/admin/piercings" className="flex items-center space-x-2 hover:text-purple-300">
              <FaRing />
              <span>Piercings</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/tattoos" className="flex items-center space-x-2 hover:text-purple-300">
              <FaPencilAlt />
              <span>Tatuajes</span>
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="flex items-center space-x-2 hover:text-purple-300">
              <FaSignOutAlt />
              <span>Cerrar sesión</span>
            </button>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaRing, FaPencilAlt, FaSignOutAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://vinilos-backend-2cwk.onrender.com';

const AdminPanel = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        Cookies.remove('_auth');
        Cookies.remove('_refresh');
        router.push('/login');
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (err) {
      console.error('Error durante el cierre de sesión:', err);
    }
  };

  return (
    <div className="w-full md:w-64 bg-purple-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              href="/admin/piercings"
              className={`flex items-center space-x-2 w-full p-2 rounded ${
                pathname === '/admin/piercings' ? 'bg-purple-600' : 'hover:bg-purple-700'
              }`}
            >
              <FaRing />
              <span>Piercings</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/tattoos"
              className={`flex items-center space-x-2 w-full p-2 rounded ${
                pathname === '/admin/tattoos' ? 'bg-purple-600' : 'hover:bg-purple-700'
              }`}
            >
              <FaPencilAlt />
              <span>Tatuajes</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full p-2 rounded hover:bg-purple-700"
            >
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminPanel;
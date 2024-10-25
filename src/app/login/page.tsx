'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'https://vinilos-backend-2cwk.onrender.com';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        // Los tokens se establecerán automáticamente como cookies por el backend
        router.push('/admin');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error durante el inicio de sesión:', err);
      setError('Error al iniciar sesión. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Iniciar Sesión</h1>
        {error && <p className="text-red-300 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-white mb-1">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-purple-800 text-white placeholder-purple-300"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-purple-800 text-white placeholder-purple-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition duration-300"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

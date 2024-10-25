'use client'

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Cookies from 'js-cookie';

interface Tattoo {
  id: number;
  name: string;
  description: string;
  image: string;
  date: string;
}

const API_BASE_URL = 'https://vinilos-backend-2cwk.onrender.com';

const TattoosAdmin = () => {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTattoo, setEditingTattoo] = useState<Tattoo | null>(null);

  useEffect(() => {
    fetchTattoos();
  }, []);

  const fetchTattoos = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = Cookies.get('_access');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado, intentar refrescar
          await refreshToken();
          return fetchTattoos();
        }
        throw new Error('Failed to fetch tattoos');
      }

      const data = await response.json();
      setTattoos(data);
    } catch (err) {
      setError('Error al cargar los tatuajes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get('_refresh');
      const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      if (data.access) {
        Cookies.set('_access', data.access);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  const handleEdit = (tattoo: Tattoo) => {
    setEditingTattoo(tattoo);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tatuaje?')) {
      try {
        const accessToken = Cookies.get('_access');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            await refreshToken();
            return handleDelete(id);
          }
          throw new Error('Failed to delete tattoo');
        }

        setTattoos(tattoos.filter(t => t.id !== id));
      } catch (err) {
        setError('Error al eliminar el tatuaje');
        console.error(err);
      }
    }
  };

  const handleSave = async (tattoo: Tattoo) => {
    try {
      const accessToken = Cookies.get('_access');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/${tattoo.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tattoo),
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          await refreshToken();
          return handleSave(tattoo);
        }
        throw new Error('Failed to update tattoo');
      }

      setTattoos(tattoos.map(t => t.id === tattoo.id ? tattoo : t));
      setEditingTattoo(null);
    } catch (err) {
      setError('Error al actualizar el tatuaje');
      console.error(err);
    }
  };

  const handleAdd = async () => {
    const newTattoo: Omit<Tattoo, 'id'> = {
      name: 'Nuevo Tatuaje',
      description: 'Descripción del nuevo tatuaje',
      image: '/placeholder.svg',
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const accessToken = Cookies.get('_access');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTattoo),
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          await refreshToken();
          return handleAdd();
        }
        throw new Error('Failed to add tattoo');
      }

      const addedTattoo = await response.json();
      setTattoos([...tattoos, addedTattoo]);
      setEditingTattoo(addedTattoo);
    } catch (err) {
      setError('Error al añadir el tatuaje');
      console.error(err);
    }
  };

  const filteredTattoos = tattoos.filter(tattoo =>
    tattoo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white text-2xl">Cargando tatuajes...</div>;
  }

  if (error) {
    return <div className="text-white text-2xl">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-3xl font-bold text-white">Administración de Tatuajes</h2>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Buscar tatuajes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 rounded bg-purple-800 text-white placeholder-purple-300"
          />
          <FaSearch className="absolute left-3 top-3 text-purple-300" />
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300 w-full sm:w-auto"
        >
          <FaPlus className="inline mr-2" /> Añadir Tatuaje
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTattoos.map(tattoo => (
          <div key={tattoo.id} className="bg-purple-800 rounded-lg p-4 relative">
            {editingTattoo?.id === tattoo.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingTattoo.name}
                  onChange={(e) => setEditingTattoo({...editingTattoo, name: e.target.value})}
                  className="w-full p-2 rounded bg-purple-700 text-white"
                />
                <textarea
                  value={editingTattoo.description}
                  onChange={(e) => setEditingTattoo({...editingTattoo, description: e.target.value})}
                  className="w-full p-2 rounded bg-purple-700 text-white"
                />
                <input
                  type="text"
                  value={editingTattoo.image}
                  onChange={(e) => setEditingTattoo({...editingTattoo, image: e.target.value})}
                  className="w-full p-2 rounded bg-purple-700 text-white"
                />
                <input
                  type="date"
                  value={editingTattoo.date}
                  onChange={(e) => setEditingTattoo({...editingTattoo, date: e.target.value})}
                  className="w-full p-2 rounded bg-purple-700 text-white"
                />
                <button
                  onClick={() => handleSave(editingTattoo)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300 w-full"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <>
                <img src={tattoo.image} alt={tattoo.name} className="w-full h-48 object-cover rounded-t-lg" />
                <h3 className="text-xl font-bold text-white mt-2">{tattoo.name}</h3>
                <p className="text-purple-200">{tattoo.description}</p>
                <p className="text-white font-bold mt-2">Fecha: {new Date(tattoo.date).toLocaleDateString()}</p>
                <div className="absolute top-2 right-2 space-x-2">
                  <button
                    onClick={() => handleEdit(tattoo)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(tattoo.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TattoosAdmin;

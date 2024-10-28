'use client'

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface Piercing {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | File;
}

const API_BASE_URL = 'https://vinilos-backend-2cwk.onrender.com';

const PiercingsAdmin = () => {
  const [piercings, setPiercings] = useState<Piercing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPiercing, setEditingPiercing] = useState<Piercing | null>(null);

  useEffect(() => {
    fetchPiercings();
  }, []);

  const fetchPiercings = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = Cookies.get('_access');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/piercs/piercings/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          await refreshToken();
          return fetchPiercings();
        }
        throw new Error('Failed to fetch piercings');
      }

      const data = await response.json();
      setPiercings(data);
    } catch (err) {
      setError('Error al cargar los piercings');
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

  const handleEdit = (piercing: Piercing) => {
    setEditingPiercing(piercing);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este piercing?')) {
      try {
        const accessToken = Cookies.get('_access');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/piercs/piercings/${id}/`, {
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
          throw new Error('Failed to delete piercing');
        }

        setPiercings(piercings.filter(p => p.id !== id));
      } catch (err) {
        setError('Error al eliminar el piercing');
        console.error(err);
      }
    }
  };

  const handleSave = async (piercing: Piercing) => {
    try {
      const accessToken = Cookies.get('_access');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const formData = new FormData();
      formData.append('name', piercing.name);
      formData.append('description', piercing.description);
      formData.append('price', piercing.price.toString());

      if (piercing.image instanceof File) {
        const base64Image = await convertToBase64(piercing.image);
        formData.append('image', base64Image);
      }

      const response = await fetch(`${API_BASE_URL}/api/piercs/piercings/${piercing.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          await refreshToken();
          return handleSave(piercing);
        }
        throw new Error('Failed to update piercing');
      }

      const updatedPiercing = await response.json();
      setPiercings(piercings.map(p => p.id === piercing.id ? updatedPiercing : p));
      setEditingPiercing(null);
    } catch (err) {
      setError('Error al actualizar el piercing');
      console.error(err);
    }
  };

  const handleAdd = async () => {
    const newPiercing: Omit<Piercing, 'id'> = {
      name: 'Nuevo Piercing',
      description: 'Descripción del nuevo piercing',
      price: 0,
      image: '',
    };

    try {
      const accessToken = Cookies.get('_access');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const formData = new FormData();
      formData.append('name', newPiercing.name);
      formData.append('description', newPiercing.description);
      formData.append('price', newPiercing.price.toString());

      const response = await fetch(`${API_BASE_URL}/api/piercs/piercings/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          await refreshToken();
          return handleAdd();
        }
        throw new Error('Failed to add piercing');
      }

      const addedPiercing = await response.json();
      setPiercings([...piercings, addedPiercing]);
      setEditingPiercing(addedPiercing);
    } catch (err) {
      setError('Error al añadir el piercing');
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingPiercing) {
      setEditingPiercing({
        ...editingPiercing,
        image: e.target.files[0]
      });
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const filteredPiercings = piercings.filter(piercing =>
    piercing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white text-2xl">Cargando piercings...</div>;
  }

  if (error) {
    return <div className="text-white text-2xl">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-3xl font-bold text-white">Administración de Piercings</h2>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Buscar piercings..."
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
          <FaPlus className="inline mr-2" /> Añadir Piercing
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPiercings.map(piercing => (
          <div key={piercing.id} className="bg-purple-800 rounded-lg p-4 relative">
            {editingPiercing?.id === piercing.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingPiercing.name}
                  onChange={(e) => setEditingPiercing({...editingPiercing, name: e.target.value})}
                  className="w-full p-2 rounded bg-purple-700 text-white"
                />
                <textarea
                  value={editingPiercing.description}
                  onChange={(e) => setEditingPiercing({...editingPiercing, description: e.target.value})}
                  className="w-full p-2 rounded bg-purple-700 text-white"
                />
                <input
                  type="number"
                  value={editingPiercing.price}
                  onChange={(e) => setEditingPiercing({...editingPiercing, price: parseFloat(e.target.value)})}
                  className="w-full p-2 rounded bg-purple-700 text-white"
                />
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full p-2 rounded bg-purple-700 text-white"
                />
                <button
                  onClick={() => handleSave(editingPiercing)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300 w-full"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <>
                <div className="relative w-full h-48">
                  <Image
                    src={typeof piercing.image === 'string' ? piercing.image : URL.createObjectURL(piercing.image)}
                    alt={piercing.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mt-2">{piercing.name}</h3>
                <p className="text-purple-200">{piercing.description}</p>
                <p className="text-white font-bold mt-2">Precio: ${piercing.price}</p>
                <div className="absolute top-2 right-2 space-x-2">
                  <button
                    onClick={() => handleEdit(piercing)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(piercing.id)}
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

export default PiercingsAdmin;

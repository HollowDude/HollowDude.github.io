'use client'

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

interface Tattoo {
  id: number;
  name: string;
  description: string;
  image: string | File;
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

      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/`);

      if (!response.ok) {
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

  const handleEdit = (tattoo: Tattoo) => {
    setEditingTattoo(tattoo);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tatuaje?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/${id}/`, {
          method: 'DELETE',
        });

        if (!response.ok) {
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
      const formData = new FormData();
      formData.append('name', tattoo.name);
      formData.append('description', tattoo.description);
      formData.append('date', tattoo.date);
      
      if (tattoo.image instanceof File) {
        formData.append('image', tattoo.image);
      }

      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/${tattoo.id}/`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update tattoo');
      }

      const updatedTattoo = await response.json();
      setTattoos(tattoos.map(t => t.id === tattoo.id ? updatedTattoo : t));
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
      image: '',
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const formData = new FormData();
      formData.append('name', newTattoo.name);
      formData.append('description', newTattoo.description);
      formData.append('date', newTattoo.date);

      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingTattoo) {
      setEditingTattoo({
        ...editingTattoo,
        image: e.target.files[0]
      });
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
                  type="date"
                  value={editingTattoo.date}
                  onChange={(e) => setEditingTattoo({...editingTattoo, date: e.target.value})}
                  className="w-full p-2 rounded bg-purple-700 text-white"
                />
                <input
                  type="file"
                  onChange={handleImageChange}
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
                <img 
                  src={tattoo.image instanceof File ? URL.createObjectURL(tattoo.image) : tattoo.image} 
                  alt={tattoo.name} 
                  className="w-full h-48 object-cover rounded-t-lg" 
                />
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
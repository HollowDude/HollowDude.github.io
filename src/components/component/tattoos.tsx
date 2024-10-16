'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface Tattoo {
  id: number;
  name: string;
  description: string;
  image: string;
  date: string;
}

const API_BASE_URL = 'https://vinilos-backend-2cwk.onrender.com';

const TattooPortfolio = () => {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tattoosPerPage = 5;

  useEffect(() => {
    const fetchTattoos = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Iniciando solicitud de token...');
        const tokenResponse = await fetch(`${API_BASE_URL}/api/token/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: "hollow",
            password: "2502"
          }),
        });

        console.log('Respuesta de token recibida:', tokenResponse.status);
        if (!tokenResponse.ok) {
          throw new Error(`Failed to obtain access token. Status: ${tokenResponse.status}`);
        }

        const { access } = await tokenResponse.json();
        console.log('Token obtenido exitosamente');

        console.log('Iniciando solicitud de tatuajes...');
        const tattoosResponse = await fetch(`${API_BASE_URL}/api/tatts/tattoos`, {
          headers: {
            'Authorization': `Bearer ${access}`,
          },
        });

        console.log('Respuesta de tatuajes recibida:', tattoosResponse.status);
        if (!tattoosResponse.ok) {
          throw new Error(`Failed to fetch tattoos data. Status: ${tattoosResponse.status}`);
        }

        const tattoosData = await tattoosResponse.json();
        console.log('Datos de tatuajes obtenidos:', tattoosData.length);
        setTattoos(tattoosData);
      } catch (err) {
        console.error('Error detallado:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTattoos();
  }, []);

  const indexOfLastTattoo = currentPage * tattoosPerPage;
  const indexOfFirstTattoo = indexOfLastTattoo - tattoosPerPage;
  const currentTattoos = tattoos.slice(indexOfFirstTattoo, indexOfLastTattoo);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#3a3a3a] flex items-center justify-center">
      <p className="text-white text-2xl">Cargando tatuajes...</p>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#3a3a3a] flex items-center justify-center">
      <div className="text-white text-center">
        <p className="text-2xl mb-4">Error: {error}</p>
        <p className="text-lg">Por favor, intenta recargar la página. Si el problema persiste, contacta al administrador.</p>
        <p className="text-sm mt-4">Detalles técnicos: Revisa la consola del navegador para más información.</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#3a3a3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center mb-6">
          <Link href="/" className="mr-4 text-white hover:text-gray-300 transition-all duration-300 transform hover:-translate-x-1">
            <FaArrowLeft className="text-2xl" />
          </Link>
          <h1 className="text-4xl font-bold text-center text-white">Nuestros Trabajos</h1>
        </div>

        {tattoos.length === 0 ? (
          <p className="text-white text-center text-xl">No se encontraron tatuajes disponibles.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentTattoos.map((tattoo) => (
                <div key={tattoo.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
                  <img src={tattoo.image} alt={tattoo.name} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">{tattoo.name}</h2>
                    <p className="text-gray-300 mb-4">{tattoo.description}</p>
                    <p className="text-sm text-gray-400">Fecha: {new Date(tattoo.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              {Array.from({ length: Math.ceil(tattoos.length / tattoosPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-4 py-2 rounded-full ${
                    currentPage === i + 1
                      ? 'bg-white text-[#1a1a1a]'
                      : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                  } transition duration-300`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TattooPortfolio;
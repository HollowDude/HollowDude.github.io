'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaArrowLeft } from 'react-icons/fa';

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

  const whatsappLink = "https://wa.me/+5358228400?text=Quiero%20agendar%20una%20cita";

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center">
      <p className="text-white text-2xl">Cargando tatuajes...</p>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center">
      <div className="text-white text-center">
        <p className="text-2xl mb-4">Error: {error}</p>
        <p className="text-lg">Por favor, intenta recargar la página. Si el problema persiste, contacta al administrador.</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center mb-6">
          <Link href="/" className="mr-4 text-white hover:text-purple-200 transition-all duration-300 transform hover:-translate-x-1">
            <FaArrowLeft className="text-2xl" />
          </Link>
          <h1 className="text-4xl font-bold text-center text-white">Nuestros Trabajos</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentTattoos.map((tattoo) => (
            <div key={tattoo.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
              <img src={tattoo.image} alt={tattoo.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-2">{tattoo.name}</h2>
                <p className="text-sm text-purple-200 mb-3">Fecha: {new Date(tattoo.date).toLocaleDateString()}</p>
                <p className="text-gray-200">{tattoo.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mb-12">
          {Array.from({ length: Math.ceil(tattoos.length / tattoosPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-4 py-2 rounded-full ${
                currentPage === i + 1
                  ? 'bg-white text-purple-700'
                  : 'bg-purple-200 text-purple-700 hover:bg-white hover:text-purple-700'
              } transition duration-300`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Tatuador</h2>
          <div className="flex flex-col md:flex-row items-center">
            <img src="/yo3.jpg" alt="Tatuador" className="w-64 h-64 object-cover rounded-full mb-6 md:mb-0 md:mr-8" />
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">Xavier Verdecie Ramos</h3>
              <p className="text-gray-200 mb-4">Artista Tatuador forjado por la vieja escuela, dibuja él mismo el diseño que quieras y es aficionado al BlackWork</p>
              <p className="text-lg font-bold text-white mb-4">Teléfono: +53 58-22-84-00</p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition duration-300"
              >
                <FaWhatsapp className="mr-2" />
                Contáctame por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TattooPortfolio;
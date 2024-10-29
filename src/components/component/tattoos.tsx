'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    fetchTattoos();
  }, []);

  const fetchTattoos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/tatts/tattoos/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch tattoos data. Status: ${response.status}`);
      }

      const data = await response.json();
      setTattoos(data);
    } catch (err) {
      console.error('Error detallado:', err);
      setError('Error al cargar los tatuajes');
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastTattoo = currentPage * tattoosPerPage;
  const indexOfFirstTattoo = indexOfLastTattoo - tattoosPerPage;
  const currentTattoos = tattoos.slice(indexOfFirstTattoo, indexOfLastTattoo);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const whatsappLink = "https://wa.me/+5358228400?text=Quiero%20agendar%20una%20cita";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-white text-2xl">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-2xl mb-4">Se ha producido un error :c</p>
          <p className="text-2xl mb-4">Contacta con el Administrador</p>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
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
              <div className="relative w-full h-64">
                <Image
                  src={tattoo.image}
                  alt={tattoo.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
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
            <div className="relative w-64 h-64 rounded-full overflow-hidden mb-6 md:mb-0 md:mr-8">
              <Image
                src="/yo3.jpg"
                alt="Tatuador"
                layout="fill"
                objectFit="cover"
              />
            </div>
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
                Agenda una cita YA!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TattooPortfolio;
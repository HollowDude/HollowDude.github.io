'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaArrowLeft } from 'react-icons/fa';

interface Piercing {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const PiercingPortfolio = () => {
  const [piercings, setPiercings] = useState<Piercing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const piercingsPerPage = 5;

  useEffect(() => {
    const fetchPiercings = async () => {
      try {
        // Obtener el token de acceso
        const tokenResponse = await fetch('https://vinilos-backend-2cwk.onrender.com/api/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: "hollow",
            password: "2502"
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to obtain access token');
        }

        const { access } = await tokenResponse.json();

        // Obtener los datos de los piercings
        const piercingsResponse = await fetch('https://vinilos-backend-2cwk.onrender.com/api/piercs/piercings', {
          headers: {
            'Authorization': `Bearer ${access}`,
          },
        });

        if (!piercingsResponse.ok) {
          throw new Error('Failed to fetch piercings data');
        }

        const piercingsData = await piercingsResponse.json();
        setPiercings(piercingsData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchPiercings();
  }, []);

  const indexOfLastPiercing = currentPage * piercingsPerPage;
  const indexOfFirstPiercing = indexOfLastPiercing - piercingsPerPage;
  const currentPiercings = piercings.slice(indexOfFirstPiercing, indexOfLastPiercing);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getWhatsAppLink = (piercingName: string, price: number) => {
    const message = encodeURIComponent(`Hola, estoy interesado/a en comprar el piercing ${piercingName} por $${price}. ¿Podría darme más información?`);
    return `https://wa.me/+5358622909?text=${message}`;
  };

  const scheduleAppointmentLink = "https://wa.me/+5358622909?text=Hola,%20me%20gustaría%20agendar%20una%20cita%20para%20un%20piercing.";

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#9370DB] via-[#8A5CD8] to-[#663399] flex items-center justify-center">
      <p className="text-white text-2xl">Cargando piercings...</p>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-[#9370DB] via-[#8A5CD8] to-[#663399] flex items-center justify-center">
      <p className="text-white text-2xl">Error: {error}</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9370DB] via-[#8A5CD8] to-[#663399]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center mb-6">
          <Link href="/" className="mr-4 text-white hover:text-purple-200 transition-all duration-300 transform hover:-translate-x-1">
            <FaArrowLeft className="text-2xl" />
          </Link>
          <h1 className="text-4xl font-bold text-center text-white">Catálogo de Piercings</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentPiercings.map((piercing) => (
            <div key={piercing.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden flex flex-col">
              <img src={piercing.image} alt={piercing.name} className="w-full h-64 object-cover" />
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold text-white mb-2">{piercing.name}</h2>
                <p className="text-gray-200 mb-3 flex-grow">{piercing.description}</p>
                <p className="text-lg font-bold text-white mb-4">Precio: ${piercing.price}</p>
                <a
                  href={getWhatsAppLink(piercing.name, piercing.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-purple-500 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Comprar
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-12">
          {Array.from({ length: Math.ceil(piercings.length / piercingsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-4 py-2 rounded-full ${
                currentPage === i + 1
                  ? 'bg-white text-[#9370DB]'
                  : 'bg-[#8A5CD8] text-white hover:bg-[#7B4ECF]'
              } transition duration-300`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Perforadora</h2>
          <div className="flex flex-col md:flex-row items-center">
            <img src="IMG_9752.jpg" alt="Perforadora" className="w-64 h-64 object-cover rounded-full mb-6 md:mb-0 md:mr-8" />
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">Marisney Rivero Marquez</h3>
              <p className="text-gray-200 mb-4">Perforadora profesional con basta experiencia, trabaja con total higiene y con mucha delicadeza.</p>
              <p className="text-lg font-bold text-white mb-4">Teléfono: +53 58-62-29-09</p>
              <a
                href={scheduleAppointmentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition duration-300"
              >
                <FaWhatsapp className="mr-2" />
                Agendar Cita
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiercingPortfolio;
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

// Datos de ejemplo para los piercings
const piercings = [
  {
    id: 1,
    name: "Helix",
    description: "Perforación en el borde superior de la oreja.",
    price: 40,
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    id: 2,
    name: "Septum",
    description: "Perforación en el tabique nasal.",
    price: 50,
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    id: 3,
    name: "Labret",
    description: "Perforación debajo del labio inferior.",
    price: 45,
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    id: 4,
    name: "Industrial",
    description: "Perforación que conecta dos puntos en la oreja.",
    price: 60,
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    id: 5,
    name: "Tragus",
    description: "Perforación en la pequeña porción de cartílago frente al canal auditivo.",
    price: 55,
    image: "/placeholder.svg?height=300&width=300"
  },
  // Agrega más piercings aquí para simular paginación
];

const PiercingPortfolio = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const piercingsPerPage = 5;
  const indexOfLastPiercing = currentPage * piercingsPerPage;
  const indexOfFirstPiercing = indexOfLastPiercing - piercingsPerPage;
  const currentPiercings = piercings.slice(indexOfFirstPiercing, indexOfLastPiercing);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getWhatsAppLink = (piercingName: string, price: number) => {
    const message = encodeURIComponent(`Hola, estoy interesado/a en comprar el piercing ${piercingName} por $${price}. ¿Podría darme más información?`);
    return `https://wa.me/+5358622909?text=${message}`;
  };

  const scheduleAppointmentLink = "https://wa.me/+5358622909?text=Hola,%20me%20gustaría%20agendar%20una%20cita%20para%20un%20piercing.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9370DB] via-[#8A5CD8] to-[#663399]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-white mb-6">Catálogo de Piercings</h1>
        <div className="flex justify-center mb-8">
          <Link href="/" className="bg-white text-[#9370DB] font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition duration-300">
            Inicio
          </Link>
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
                  className="block w-full text-center bg-[#9370DB] text-white font-bold py-2 px-4 rounded-full hover:bg-[#8A5CD8] transition duration-300 transform hover:scale-105"
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
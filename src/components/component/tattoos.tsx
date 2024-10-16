'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

// Datos de ejemplo para los tatuajes
const tattoos = [
  {
    id: 1,
    name: "Dragón Japonés",
    date: "2023-05-15",
    description: "Tatuaje de dragón estilo irezumi con detalles intrincados y colores vibrantes.",
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    id: 2,
    name: "Mandala Floral",
    date: "2023-06-22",
    description: "Diseño de mandala delicado con motivos florales en tinta negra.",
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    id: 3,
    name: "Lobo Geométrico",
    date: "2023-07-10",
    description: "Representación minimalista de un lobo utilizando formas geométricas.",
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    id: 4,
    name: "Ancla Náutica",
    date: "2023-08-05",
    description: "Tatuaje tradicional de ancla con detalles de cuerda y golondrina.",
    image: "/placeholder.svg?height=300&width=300"
  },
  {
    id: 5,
    name: "Galaxia en Acuarela",
    date: "2023-09-18",
    description: "Representación colorida de una galaxia utilizando técnicas de acuarela.",
    image: "/placeholder.svg?height=300&width=300"
  },
  // Agrega más tatuajes aquí para simular paginación
];

const TattooPortfolio = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const tattoosPerPage = 5;
  const indexOfLastTattoo = currentPage * tattoosPerPage;
  const indexOfFirstTattoo = indexOfLastTattoo - tattoosPerPage;
  const currentTattoos = tattoos.slice(indexOfFirstTattoo, indexOfLastTattoo);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const whatsappLink = "https://wa.me/+5358228400?text=Quiero%20agendar%20una%20cita";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-white mb-6">Nuestros Trabajos</h1>
        <div className="flex justify-center mb-8">
          <Link href="/" className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full hover:bg-purple-200 transition duration-300">
            Inicio
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentTattoos.map((tattoo) => (
            <div key={tattoo.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
              <img src={tattoo.image} alt={tattoo.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-2">{tattoo.name}</h2>
                <p className="text-sm text-purple-200 mb-3">Fecha: {tattoo.date}</p>
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
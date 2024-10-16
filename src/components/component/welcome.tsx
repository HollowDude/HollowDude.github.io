import Link from "next/link"
import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa'
import { GiPiercedHeart, GiPencil } from 'react-icons/gi'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
      {/* Contenido */}
      <div className="relative z-10">
        {/* Header */}
        <header className="p-2">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Image
              src='/Vinilos.png'
              alt="Logo del Negocio" 
              width={80}
              height={40}
              className="h-10 w-auto"
            />
            <a 
              href="https://chat.whatsapp.com/your-group-invite-link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-purple-200 transition duration-300 flex items-center"
            >
              <FaWhatsapp className="mr-2" />
              Unirse al grupo de WhatsApp
            </a>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            <Link
              href="/piercings"
              className="flex-1 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white hover:bg-opacity-20 transition duration-300 flex flex-col justify-between min-h-[400px]"
            >
              <div>
                <div className="flex items-center mb-4">
                  <GiPiercedHeart className="text-4xl mr-2 text-purple-300" />
                  <h2 className="text-3xl font-bold">Piercings</h2>
                </div>
                <p className="mb-4">
                  Explora nuestra amplia selección de piercings de alta calidad y encuentra el que mejor se adapte a tu estilo.
                </p>
              </div>
              <span className="inline-block bg-purple-600 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-700 transition duration-300 self-start">
                Visitar
              </span>
            </Link>

            <Link
              href="/tattoos"
              className="flex-1 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white hover:bg-opacity-20 transition duration-300 flex flex-col justify-between min-h-[400px]"
            >
              <div>
                <div className="flex items-center mb-4">
                  <GiPencil className="text-4xl mr-2 text-purple-300" />
                  <h2 className="text-3xl font-bold">Tatuajes</h2>
                </div>
                <p className="mb-4">
                  Descubre nuestros diseños exclusivos y deja que nuestros artistas plasmen tu visión en tu piel.
                </p>
              </div>
              <span className="inline-block bg-purple-600 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-700 transition duration-300 self-start">
                Visitar
              </span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
import Link from "next/link"
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa'
import { GiPiercedHeart, GiPencil } from 'react-icons/gi'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
      <div className="relative z-10">
        {/* Header */}
        <header className="p-2">
          <div className="max-w-7xl mx-auto flex justify-end items-center">
            <a 
              href="https://chat.whatsapp.com/your-group-invite-link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition duration-300"
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
              className="flex-1 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white hover:bg-opacity-20 transition duration-300 flex flex-col justify-between min-h-[400px] relative group"
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
              <FaArrowRight className="absolute bottom-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              href="/tattoos"
              className="flex-1 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white hover:bg-opacity-20 transition duration-300 flex flex-col justify-between min-h-[400px] relative group"
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
              <FaArrowRight className="absolute bottom-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
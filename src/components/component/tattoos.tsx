'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaArrowLeft } from 'react-icons/fa';
import Cookies from 'js-cookie';

interface Tattoo {
  id: number;
  name: string;
  description: string;
  image: string;
  date: string;
}

const API_BASE_URL = 'https://vinilos-backend-2cwk.onrender.com';

// En un entorno real, estas credenciales deberían estar en un .env
const USERNAME = process.env.NEXT_PUBLIC_USERNAME;
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD;

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

        let accessToken = Cookies.get('_access');
        const refreshToken = Cookies.get('_refresh');
        console.log("Access token inicial:", accessToken);

        if (!accessToken || !refreshToken) {
          console.log("No hay tokens, obteniendo nuevos...");
          await getNewTokens();
          accessToken = Cookies.get('_access');
          console.log("Nuevo access token:", accessToken);
        }

        if (accessToken) {
          console.log("Intentando obtener datos de tatuajes...");
          const tattoosData = await fetchTattoosData(accessToken);
          setTattoos(tattoosData);
        } else {
          throw new Error('No se pudo obtener el token de acceso');
        }
      } catch (err) {
        console.error('Error detallado:', err);
        setError('Error al cargar los tatuajes');
      } finally {
        setLoading(false);
      }
    };

    fetchTattoos();
  }, []);

  const getNewTokens = async () => {
    try {
      const tokenResponse = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: USERNAME,
          password: PASSWORD,
        }),
        credentials: 'include',
      });

      if (!tokenResponse.ok) {
        throw new Error(`Failed to obtain access token. Status: ${tokenResponse.status}`);
      }

      const data = await tokenResponse.json();
      console.log("Respuesta de login:", data);

      // Establecer manualmente las cookies si el backend no lo hace
      if (data.access) Cookies.set('_access', data.access);
      if (data.refresh) Cookies.set('_refresh', data.refresh);

      console.log("Tokens obtenidos y guardados");
    } catch (error) {
      console.error("Error al obtener tokens:", error);
      throw error;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = Cookies.get('_refresh');
      const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
        credentials: 'include',
      });

      if (!refreshResponse.ok) {
        throw new Error(`Failed to refresh token. Status: ${refreshResponse.status}`);
      }

      const data = await refreshResponse.json();
      if (data.access) {
        Cookies.set('_access', data.access);
        console.log("Token de acceso refrescado");
      }
    } catch (error) {
      console.error("Error al refrescar el token:", error);
      throw error;
    }
  };

  const fetchTattoosData = async (accessToken: string): Promise<Tattoo[]> => {
    try {
      const tattoosResponse = await fetch(`${API_BASE_URL}/api/tatts/tattoos/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (tattoosResponse.status === 401) {
        console.log("Token expirado, intentando refrescar...");
        await refreshAccessToken();
        const newAccessToken = Cookies.get('_access');
        if (newAccessToken) {
          return fetchTattoosData(newAccessToken);
        } else {
          throw new Error('No se pudo refrescar el token de acceso');
        }
      }

      if (!tattoosResponse.ok) {
        throw new Error(`Failed to fetch tattoos data. Status: ${tattoosResponse.status}`);
      }

      const data = await tattoosResponse.json();
      console.log("Datos de tatuajes obtenidos:", data);
      return data;
    } catch (error) {
      console.error("Error al obtener datos de tatuajes:", error);
      throw error;
    }
  };

  // ... (el resto del componente permanece igual)
};

export default TattooPortfolio;

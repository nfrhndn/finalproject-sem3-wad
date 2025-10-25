import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Helper untuk fetch dan simpan film dari TMDB.
 * @param {string} endpoint
 * @param {number} page
 */
export const fetchFromTMDB = async (endpoint, page = 1) => {
  const API_KEY = process.env.TMDB_API_KEY;
  if (!API_KEY) throw new Error("TMDB_API_KEY tidak ditemukan di .env");

  const existingMovies = await prisma.movie.findMany({
    where: { source: "TMDB", status: "PUBLISHED" },
    take: 20,
    skip: (page - 1) * 20,
  });

  if (existingMovies.length > 0) {
    console.log(`📦 Mengambil dari database (${endpoint})`);
    return { results: existingMovies };
  }

  console.log(`🌐 Fetch dari TMDB (${endpoint})`);
  const response = await axios.get(`${BASE_URL}/movie/${endpoint}`, {
    params: { api_key: API_KEY, language: "id-ID", page },
  });

  const movies = response.data.results;

  for (const m of movies) {
    try {
      const trailerRes = await axios.get(`${BASE_URL}/movie/${m.id}/videos`, {
        params: { api_key: API_KEY, language: "en-US" },
      });

      const trailer = trailerRes.data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      const trailerUrl = trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : null;

      for (const g of m.genre_ids) {
        await prisma.genre.upsert({
          where: { id: g },
          update: {},
          create: { id: g, name: `Genre ${g}` },
        });
      }

      await prisma.movie.upsert({
        where: { tmdbId: m.id },
        update: {
          trailerUrl,
          posterUrl: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : null,
          backdropUrl: m.backdrop_path
            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
            : null,
        },
        create: {
          tmdbId: m.id,
          title: m.title,
          description: m.overview || "Deskripsi tidak tersedia.",
          releaseDate: m.release_date ? new Date(m.release_date) : null,
          duration: null,
          posterUrl: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : null,
          backdropUrl: m.backdrop_path
            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
            : null,
          trailerUrl,
          source: "TMDB",
          status: "PUBLISHED",
          isPublished: true,
          genres: {
            create: m.genre_ids.map((g) => ({
              genre: { connect: { id: g } },
            })),
          },
        },
      });
    } catch (err) {
      console.error(`❌ Gagal simpan film TMDB ID ${m.id}:`, err.message);
    }
  }

  return response.data;
};

export const fetchTrailerUrl = async (tmdbId) => {
  const API_KEY = process.env.TMDB_API_KEY;
  if (!API_KEY) throw new Error("TMDB_API_KEY tidak ditemukan di .env");

  try {
    const res = await axios.get(`${BASE_URL}/movie/${tmdbId}/videos`, {
      params: { api_key: API_KEY, language: "en-US" },
    });

    const trailer = res.data.results.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (err) {
    console.error(
      `❌ Gagal fetch trailer untuk TMDB ID ${tmdbId}:`,
      err.message
    );
    return null;
  }
};

import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const importFromTMDB = async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "TMDB_API_KEY belum diatur di file .env",
      });
    }

    const allMovies = [];
    for (let page = 1; page <= 5; page++) {
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`;
      const response = await axios.get(url);

      if (response.data.results && response.data.results.length > 0) {
        allMovies.push(...response.data.results);
      } else {
        break;
      }

      await new Promise((r) => setTimeout(r, 300));
    }

    console.log(`📦 Total film diambil dari TMDB: ${allMovies.length}`);

    let importedCount = 0;

    for (const movie of allMovies) {
      const existing = await prisma.movie.findUnique({
        where: { tmdbId: movie.id },
      });

      if (existing) {
        console.log(`⏭️ Film "${movie.title}" sudah ada, dilewati.`);
        continue;
      }

      const detailUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US`;
      const detailRes = await axios.get(detailUrl);
      const detail = detailRes.data;

      const genreIds = [];
      for (const g of detail.genres || []) {
        if (!g.name) {
          console.warn("⚠️ Genre tanpa nama dilewati:", g);
          continue;
        }

        let genre;
        try {
          genre = await prisma.genre.upsert({
            where: { name: g.name },
            update: {},
            create: { name: g.name },
          });
        } catch (err) {
          console.error("❌ Gagal upsert genre:", g.name, err.message);
          continue;
        }

        genreIds.push(genre.id);
      }

      await prisma.movie.create({
        data: {
          tmdbId: movie.id,
          title: movie.title,
          description: movie.overview || "Deskripsi tidak tersedia.",
          releaseDate: movie.release_date ? new Date(movie.release_date) : null,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          backdropUrl: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : null,
          duration: detail.runtime || null,
          source: "TMDB",
          status: "DRAFT",
          isPublished: false,
          genres: {
            create: genreIds.map((gid) => ({
              genre: { connect: { id: gid } },
            })),
          },
        },
      });

      importedCount++;
      console.log(`✅ Film baru ditambahkan: ${movie.title}`);

      await new Promise((r) => setTimeout(r, 300));
    }

    const totalMovies = await prisma.movie.count();

    return res.status(200).json({
      success: true,
      message: `✅ Import dari TMDB berhasil! (${importedCount} film baru ditambahkan, total ${totalMovies} film di database)`,
      importedCount,
      totalMovies,
    });
  } catch (error) {
    console.error("❌ Error import TMDB:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengimpor film dari TMDB",
    });
  }
};

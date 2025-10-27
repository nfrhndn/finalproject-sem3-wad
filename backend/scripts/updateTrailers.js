import { PrismaClient } from "@prisma/client";
import { fetchTrailerUrl } from "../helpers/tmdbHelper.js";

const prisma = new PrismaClient();

const updateTrailers = async () => {
  const movies = await prisma.movie.findMany({
    where: { trailerUrl: null, source: "TMDB" },
    select: { id: true, tmdbId: true, title: true },
  });

  console.log(`🎬 ${movies.length} film belum punya trailer.`);

  for (const movie of movies) {
    try {
      const trailerUrl = await fetchTrailerUrl(movie.tmdbId);
      if (trailerUrl) {
        await prisma.movie.update({
          where: { id: movie.id },
          data: { trailerUrl },
        });
        console.log(`✅ ${movie.title} -> ${trailerUrl}`);
      } else {
        console.log(`⚠️ ${movie.title} tidak memiliki trailer`);
      }
    } catch (err) {
      console.error(`❌ Gagal update ${movie.title}:`, err.message);
    }
  }

  console.log("✅ Selesai update semua trailer.");
  process.exit(0);
};

updateTrailers();

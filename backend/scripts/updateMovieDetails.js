// backend/scripts/updateMovieDetails.js
import { prisma } from "../lib/prisma.js";
import fetch from "node-fetch";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function updateMovieDetails() {
    const movies = await prisma.movie.findMany({
        where: { isPublished: true },
    });

    for (const movie of movies) {
        if (!movie.tmdbId) continue;

        const res = await fetch(
            `${BASE_URL}/movie/${movie.tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!res.ok) continue;

        const data = await res.json();

        const genresFromTMDB = data.genres?.map((g) => g.name) || [];
        const genreConnections = [];

        for (const genreName of genresFromTMDB) {
            const genre = await prisma.genre.upsert({
                where: { name: genreName },
                update: {},
                create: { name: genreName },
            });
            genreConnections.push({ genreId: genre.id });
        }

        const trailerRes = await fetch(
            `${BASE_URL}/movie/${movie.tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const trailerData = await trailerRes.json();
        const youtubeTrailer = trailerData.results?.find(
            (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        const trailerUrl = youtubeTrailer
            ? `https://www.youtube.com/watch?v=${youtubeTrailer.key}`
            : movie.trailerUrl;

        await prisma.movie.update({
            where: { id: movie.id },
            data: {
                duration: data.runtime || movie.duration,
                rating: data.vote_average || movie.rating,
                description: data.overview || movie.description,
                trailerUrl,
                genres: {
                    deleteMany: {},
                    create: genreConnections,
                },
            },
        });

        console.log(`✅ Updated: ${movie.title}`);
    }

    console.log("🎉 Semua movie berhasil diperbarui dengan rating, durasi, genre, dan trailer.");
}

updateMovieDetails()
    .catch((err) => console.error(err))
    .finally(() => prisma.$disconnect());

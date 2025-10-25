import { PrismaClient } from "@prisma/client";
import { fetchFromTMDB, fetchTrailerUrl } from "../helpers/tmdbHelper.js";

const prisma = new PrismaClient();

export const getAllMovies = async (req, res) => {
  try {
    const { status } = req.query;

    const statusMap = {
      "Sedang Tayang": "PUBLISHED",
      "Akan Tayang": "UPCOMING",
      "Tidak Tayang": "DRAFT",
      Semua: "ALL",
      ALL: "ALL",
    };

    const mappedStatus = statusMap[status] || "ALL";

    const whereClause = mappedStatus !== "ALL" ? { status: mappedStatus } : {};

    const movies = await prisma.movie.findMany({
      where: whereClause,
      include: {
        genres: { include: { genre: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!movies || movies.length === 0) {
      return res.status(200).json({
        message: "Belum ada data film di database. Silakan import dari TMDB.",
        movies: [],
      });
    }

    const formatted = movies.map((m) => ({
      id: m.id,
      title: m.title || "Judul Tidak Tersedia",
      description: m.description || "Deskripsi tidak tersedia.",
      releaseDate: m.releaseDate || "Tanggal rilis tidak diketahui",
      posterUrl:
        m.posterUrl || "https://via.placeholder.com/300x450?text=No+Poster",
      backdropUrl: m.backdropUrl || null,
      duration: m.duration || 0,
      status: m.status || "DRAFT",
      isPublished: m.isPublished ?? false,
      genres:
        m.genres && m.genres.length > 0
          ? m.genres.map((g) => g.genre.name)
          : ["Tanpa Genre"],
      createdAt: m.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Error getAllMovies:", error);
    res.status(500).json({
      error: "Gagal mengambil data film",
      details: error.message,
    });
  }
};

export const importMoviesFromTMDB = async (req, res) => {
  try {
    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) {
      return res
        .status(500)
        .json({ error: "TMDB_API_KEY belum diset di file .env" });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=id-ID&page=1`
    );
    const data = await response.json();

    if (!data.results) {
      return res.status(400).json({ error: "Gagal mengambil data dari TMDB" });
    }

    const importedMovies = [];
    for (const movie of data.results) {
      const existing = await prisma.movie.findUnique({
        where: { tmdbId: movie.id },
      });

      if (!existing) {
        const newMovie = await prisma.movie.create({
          data: {
            tmdbId: movie.id,
            title: movie.title,
            description: movie.overview || "Tidak ada deskripsi",
            releaseDate: movie.release_date
              ? new Date(movie.release_date)
              : null,
            posterUrl: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            backdropUrl: movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : null,
            duration: movie.runtime || 0,
            status: "PUBLISHED",
            isPublished: true,
            source: "TMDB",
          },
        });

        importedMovies.push(newMovie);
      }
    }

    res.json({
      message: `✅ Berhasil mengimpor ${importedMovies.length} film dari TMDB`,
      movies: importedMovies,
    });
  } catch (error) {
    console.error("🔥 Error importMoviesFromTMDB:", error);
    res.status(500).json({ error: "Gagal mengimpor film dari TMDB" });
  }
};

export const publishMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status publikasi harus diisi" });
    }

    const validStatuses = ["DRAFT", "PUBLISHED", "UPCOMING", "ARCHIVED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status tidak valid" });
    }

    const isPublished = status === "PUBLISHED" || status === "UPCOMING";

    const movie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: {
        status,
        isPublished,
      },
    });

    let readableStatus = "";
    switch (status) {
      case "PUBLISHED":
        readableStatus = "Sedang Tayang";
        break;
      case "UPCOMING":
        readableStatus = "Akan Tayang";
        break;
      case "ARCHIVED":
        readableStatus = "Tidak Tayang";
        break;
      default:
        readableStatus = "Draft";
    }

    res.json({
      success: true,
      message: `🎬 Film "${movie.title}" berhasil diupdate ke status "${readableStatus}"`,
      movie,
    });
  } catch (error) {
    console.error("❌ Error publishMovie:", error);
    res.status(500).json({ error: "Gagal memperbarui status film" });
  }
};

export const unpublishMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await prisma.movie.update({
      where: { id: Number(id) },
      data: {
        isPublished: false,
        status: "ARCHIVED",
      },
    });

    console.log(`🚫 Film di-unpublish: ${movie.title}`);
    res.json({ message: "Film berhasil di-unpublish", movie });
  } catch (error) {
    console.error("❌ Error unpublishMovie:", error);
    res.status(500).json({ error: "Gagal unpublish film" });
  }
};

export const editMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, genres } = req.body;

    const movie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: { title, description },
    });

    if (genres && Array.isArray(genres)) {
      await prisma.movieGenre.deleteMany({ where: { movieId: movie.id } });
      for (const gId of genres) {
        await prisma.movieGenre.create({
          data: { movieId: movie.id, genreId: gId },
        });
      }
    }

    res.json({ success: true, movie });
  } catch (error) {
    console.error("❌ Error editMovie:", error.message);
    res.status(500).json({ error: "Failed to edit movie" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.movieGenre.deleteMany({
      where: { movieId: Number(id) },
    });

    await prisma.movie.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "🗑️ Film berhasil dihapus sepenuhnya" });
  } catch (err) {
    console.error("❌ Error deleteMovie:", err);
    res.status(500).json({ error: "Gagal menghapus film" });
  }
};

export const getPopular = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const existingMovies = await prisma.movie.findMany({
      where: { source: "TMDB" },
      include: { genres: { include: { genre: true } } },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: "desc" },
    });

    if (existingMovies.length > 0) {
      return res.json({
        source: "database",
        results: existingMovies.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          releaseDate: m.releaseDate,
          posterUrl: m.posterUrl,
          backdropUrl: m.backdropUrl,
          duration: m.duration,
          status: m.status,
          genres: m.genres.map((g) => g.genre.name),
        })),
      });
    }

    const data = await fetchFromTMDB("popular", page);

    for (const m of data.results) {
      for (const g of m.genre_ids || []) {
        await prisma.genre.upsert({
          where: { id: g },
          update: {},
          create: { id: g, name: `Genre ${g}` },
        });
      }

      await prisma.movie.upsert({
        where: { tmdbId: m.id },
        update: {},
        create: {
          tmdbId: m.id,
          title: m.title,
          description: m.overview || "Deskripsi tidak tersedia.",
          releaseDate: m.release_date ? new Date(m.release_date) : null,
          posterUrl: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : null,
          backdropUrl: m.backdrop_path
            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
            : null,
          duration: null,
          source: "TMDB",
          status: "DRAFT",
          isPublished: false,
          genres: {
            create: (m.genre_ids || []).map((gid) => ({
              genre: { connect: { id: gid } },
            })),
          },
        },
      });
    }

    const savedMovies = await prisma.movie.findMany({
      where: { source: "TMDB" },
      include: { genres: { include: { genre: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      source: "tmdb",
      results: savedMovies.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        releaseDate: m.releaseDate,
        posterUrl: m.posterUrl,
        backdropUrl: m.backdropUrl,
        duration: m.duration,
        status: m.status,
        genres: m.genres.map((g) => g.genre.name),
      })),
    });
  } catch (error) {
    console.error("❌ Error getPopular:", error.message);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
};

export const getNowPlaying = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await fetchFromTMDB("now_playing", page);
    res.json(data);
  } catch (error) {
    console.error("❌ Error getNowPlaying:", error.message);
    res.status(500).json({ error: "Failed to fetch now playing movies" });
  }
};

export const getMovieDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `${id}?append_to_response=videos&language=en-US`
    );
    res.json(data);
  } catch (error) {
    console.error("❌ Error getMovieDetail:", error.message);
    res.status(500).json({ error: "Failed to fetch movie detail" });
  }
};

export const getPublishedMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      where: { status: "PUBLISHED", isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = await Promise.all(
      movies.map(async (movie) => ({
        ...movie,
        posterUrl: movie.posterUrl?.startsWith("http")
          ? movie.posterUrl
          : `https://image.tmdb.org/t/p/w500${movie.posterUrl}`,
        backdropUrl: movie.backdropUrl?.startsWith("http")
          ? movie.backdropUrl
          : `https://image.tmdb.org/t/p/original${movie.backdropUrl}`,
        trailerUrl:
          movie.trailerUrl ||
          (movie.tmdbId ? await fetchTrailerUrl(movie.tmdbId) : null),
      }))
    );

    res.json(formatted);
  } catch (error) {
    console.error("❌ Error getPublishedMovies:", error.message);
    res.status(500).json({ error: "Gagal mengambil data film" });
  }
};

export const getUpcomingMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      where: {
        status: "UPCOMING",
        isPublished: true,
      },
      orderBy: {
        releaseDate: "asc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        releaseDate: true,
        posterUrl: true,
        backdropUrl: true,
        duration: true,
        status: true,
        isPublished: true,
        genres: true,
      },
    });

    console.log("🎬 getUpcomingMovies found:", movies.length);

    return res.json(movies);
  } catch (error) {
    console.error("❌ Error getUpcomingMovies:", error);
    res.status(500).json({ error: "Gagal mengambil data film akan tayang" });
  }
};

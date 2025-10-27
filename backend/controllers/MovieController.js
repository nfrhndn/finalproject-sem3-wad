import { PrismaClient } from "@prisma/client";
import { fetchFromTMDB, fetchTrailerUrl } from "../helpers/tmdbHelper.js";

const prisma = new PrismaClient();

export const getAllMovies = async (req, res) => {
  try {
    const { status } = req.query;

    const statusMap = {
      "Sedang Tayang": "PUBLISHED",
      "Akan Tayang": "UPCOMING",
      "Tidak Tayang": "ARCHIVED",
      Semua: "ALL",
      ALL: "ALL",
    };

    const mappedStatus = statusMap[status] || "ALL";
    const whereClause = mappedStatus !== "ALL" ? { status: mappedStatus } : {};

    const movies = await prisma.movie.findMany({
      where: whereClause,
      include: { genres: { include: { genre: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (!movies.length) {
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
        m.genres?.length > 0
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
    const data = await fetchFromTMDB("now_playing", 1);
    res.json({
      message: `✅ Berhasil mengimpor ${data.results.length} film dari TMDB`,
      movies: data.results,
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

    if (!status)
      return res.status(400).json({ error: "Status publikasi harus diisi" });

    const validStatuses = ["DRAFT", "PUBLISHED", "UPCOMING", "ARCHIVED"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ error: "Status tidak valid" });

    const isPublished = ["PUBLISHED", "UPCOMING"].includes(status);

    const movie = await prisma.movie.update({
      where: { id: Number(id) },
      data: { status, isPublished },
    });

    const readableStatus = {
      PUBLISHED: "Sedang Tayang",
      UPCOMING: "Akan Tayang",
      ARCHIVED: "Tidak Tayang",
      DRAFT: "Draft",
    }[status];

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
      data: { isPublished: false, status: "ARCHIVED" },
    });
    res.json({ message: "Film berhasil di-unpublish", movie });
  } catch (error) {
    console.error("❌ Error unpublishMovie:", error);
    res.status(500).json({ error: "Gagal unpublish film" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.movieGenre.deleteMany({ where: { movieId: Number(id) } });
    await prisma.movie.delete({ where: { id: Number(id) } });

    res.json({ message: "🗑️ Film berhasil dihapus sepenuhnya" });
  } catch (error) {
    console.error("❌ Error deleteMovie:", error);
    res.status(500).json({ error: "Gagal menghapus film" });
  }
};

export const getPopular = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await fetchFromTMDB("popular", page);
    res.json(data);
  } catch (error) {
    console.error("❌ Error getPopular:", error.message);
    res.status(500).json({ error: "Gagal mengambil film populer" });
  }
};

export const getNowPlaying = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await fetchFromTMDB("now_playing", page);
    res.json(data);
  } catch (error) {
    console.error("❌ Error getNowPlaying:", error.message);
    res.status(500).json({ error: "Gagal mengambil film yang sedang tayang" });
  }
};

export const getMovieDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `${id}?append_to_response=videos&language=id-ID`
    );
    res.json(data);
  } catch (error) {
    console.error("❌ Error getMovieDetail:", error.message);
    res.status(500).json({ error: "Gagal mengambil detail film" });
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
    res.status(500).json({ error: "Gagal mengambil data film tayang" });
  }
};

export const getUpcomingMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      where: { status: "UPCOMING", isPublished: true },
      orderBy: { releaseDate: "asc" },
      include: { genres: { include: { genre: true } } },
    });

    res.json(movies);
  } catch (error) {
    console.error("❌ Error getUpcomingMovies:", error);
    res.status(500).json({ error: "Gagal mengambil film akan tayang" });
  }
};

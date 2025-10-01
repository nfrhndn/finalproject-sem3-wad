import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

export const getPopular = async (req, res) => {
  try {
    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) {
      console.error(
        "❌ TMDB_API_KEY tidak ditemukan. Pastikan sudah diset di .env"
      );
      return res.status(500).json({ error: "API Key tidak ditemukan" });
    }

    console.log("🎬 TMDB Key (Popular):", API_KEY);

    const page = req.query.page || 1;
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: API_KEY, language: "id-ID", page },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetch popular movies:", error.message);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
};

export const getNowPlaying = async (req, res) => {
  try {
    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) {
      console.error(
        "❌ TMDB_API_KEY tidak ditemukan. Pastikan sudah diset di .env"
      );
      return res.status(500).json({ error: "API Key tidak ditemukan" });
    }

    console.log("🎬 TMDB Key (Now Playing):", API_KEY);

    const page = req.query.page || 1;
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: { api_key: API_KEY, language: "id-ID", page },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetch now playing movies:", error.message);
    res.status(500).json({ error: "Failed to fetch now playing movies" });
  }
};

export const getUpcoming = async (req, res) => {
  try {
    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) {
      console.error(
        "❌ TMDB_API_KEY tidak ditemukan. Pastikan sudah diset di .env"
      );
      return res.status(500).json({ error: "API Key tidak ditemukan" });
    }

    console.log("🎬 TMDB Key (Upcoming):", API_KEY);

    const page = req.query.page || 1;
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: { api_key: API_KEY, language: "id-ID", page },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetch upcoming movies:", error.message);
    res.status(500).json({ error: "Failed to fetch upcoming movies" });
  }
};

export const getMovieDetail = async (req, res) => {
  try {
    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) {
      console.error(
        "❌ TMDB_API_KEY tidak ditemukan. Pastikan sudah diset di .env"
      );
      return res.status(500).json({ error: "API Key tidak ditemukan" });
    }

    console.log("🎬 TMDB Key (Detail):", API_KEY);

    const { id } = req.params;
    const response = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        append_to_response: "videos",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetch movie detail:", error.message);
    res.status(500).json({ error: "Failed to fetch movie detail" });
  }
};

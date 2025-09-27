import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

app.use(cors());
app.use(express.json());

if (!API_KEY) {
  console.error("❌ TMDB_API_KEY tidak ditemukan di .env");
}

app.get("/", (req, res) => {
  res.send(
    "✅ TMDB Backend API is running. Use /api/movies/popular or /api/movies/:id"
  );
});

app.get("/api/movies/popular", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: "id-ID",
        page: req.query.page || 1,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetch popular movies:", error.message);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        language: "id-ID",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetch movie detail:", error.message);
    res.status(500).json({ error: "Failed to fetch movie detail" });
  }
});

app.use((err, req, res, next) => {
  console.error("🔥 Unexpected Error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

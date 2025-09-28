import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

let users = [
  { id: 1, username: "admin", password: "123456", name: "Admin" },
  { id: 2, username: "user", password: "password", name: "Regular User" },
];

if (!API_KEY) {
  console.error("❌ TMDB_API_KEY tidak ditemukan di .env");
}

app.get("/", (req, res) => {
  res.send(
    "✅ Backend CinemaPlus is running. Use /api/movies/popular, /api/movies/:id, /api/login, or /api/register"
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
        language: "en-US",
        append_to_response: "videos",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetch movie detail:", error.message);
    res.status(500).json({ error: "Failed to fetch movie detail" });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password dibutuhkan." });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Email atau password salah." });
  }

  const safeUser = { id: user.id, email: user.email, name: user.name };

  res.json({ message: "Login sukses", user: safeUser });
});

app.post("/api/register", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Semua field harus diisi." });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "Email sudah terdaftar." });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
  };
  users.push(newUser);

  const safeUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
  res.json({ message: "Register sukses", user: safeUser });
});

app.use((err, req, res, next) => {
  console.error("🔥 Unexpected Error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

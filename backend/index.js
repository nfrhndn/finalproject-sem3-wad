import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import prisma from "./prismaClient.js";

import authRoutes from "./routes/AuthRoute.js";
import movieRoutes from "./routes/MovieRoute.js";
import bookingRoutes from "./routes/BookingRoute.js";
import cartRoutes from "./routes/CartRoute.js";
import ticketRoutes from "./routes/TicketRoute.js";
import userRoutes from "./routes/UserRoute.js";
import adminRoutes from "./routes/AdminRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma berhasil terhubung ke database!");
  } catch (err) {
    console.error("❌ Prisma gagal konek:", err);
  }
}
testDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("✅ Backend CinemaPlus is running. Use /api/movies or /api/auth");
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error("🔥 Unexpected Error:", err.stack || err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

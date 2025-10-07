import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/AuthRoute.js";
import movieRoutes from "./routes/MovieRoute.js";
import bookingRoutes from "./routes/BookingRoute.js";
import cartRoutes from "./routes/CartRoute.js";
import ticketRoutes from "./routes/TicketRoute.js";
import userRoutes from "./routes/UserRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend CinemaPlus is running. Use /api/movies or /api/auth");
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/user", userRoutes);
app.use("/uploads", express.static("uploads"));

app.use((err, req, res, next) => {
  console.error("🔥 Unexpected Error:", err.stack || err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

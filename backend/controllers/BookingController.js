import { prisma } from "../lib/prisma.js";
import { z } from "zod";

const bookingSchema = z.object({
  movieId: z.number({ required_error: "movieId wajib diisi" }).min(1),
  title: z.string({ required_error: "title wajib diisi" }).min(1),
  poster: z.string().nullable().optional(),
  cinema: z.string({ required_error: "cinema wajib diisi" }).min(1),
  date: z.string({ required_error: "date wajib diisi" }).min(4),
  time: z.string({ required_error: "time wajib diisi" }).min(1),
  seats: z
    .array(z.string().min(1))
    .nonempty({ message: "Minimal pilih 1 kursi" }),
  price: z.number({ required_error: "price wajib diisi" }).positive(),
  total: z.number({ required_error: "total wajib diisi" }).positive(),
  paymentMethod: z
    .string({ required_error: "paymentMethod wajib diisi" })
    .min(1),
});

export const createBooking = async (req, res) => {
  try {
    console.log("📩 [DEBUG] Data diterima di /api/bookings:", req.body);
    const userId = req.user?.id;
    console.log("👤 [DEBUG] userId:", userId);

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized (token tidak valid)" });
    }

    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("❌ [ZOD ERROR] Detail:", parsed.error.issues);
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || "Data booking tidak valid.",
      });
    }

    const {
      movieId,
      title,
      poster,
      cinema,
      date,
      time,
      seats,
      price,
      total,
      paymentMethod,
    } = parsed.data;

    console.log("🧩 [DEBUG] Data setelah parsing:", parsed.data);

    const seatsString = JSON.stringify(seats);
    console.log("💺 [DEBUG] Seats stringified:", seatsString);

    console.log("🔍 [DEBUG] Mengecek booking duplikat...");
    const duplicate = await prisma.booking.findFirst({
      where: {
        userId,
        movieId,
        date,
        time,
        seats: seatsString,
      },
    });
    console.log("🧠 [DEBUG] Hasil cek duplikat:", duplicate);

    if (duplicate) {
      console.log("⚠️ [DEBUG] Booking duplikat ditemukan");
      return res.status(400).json({
        success: false,
        message:
          "❌ Booking dengan detail yang sama sudah ada di keranjang kamu.",
      });
    }

    console.log("💾 [DEBUG] Menyimpan booking ke database...");
    const newBooking = await prisma.booking.create({
      data: {
        userId,
        movieId,
        title,
        poster,
        cinema,
        date,
        time,
        seats: seatsString,
        price,
        total,
        paymentMethod, // ← ini penting
      },
    });

    console.log("✅ [DEBUG] Booking berhasil disimpan:", newBooking);

    return res.status(201).json({
      success: true,
      message: "✅ Booking berhasil ditambahkan ke cart.",
      booking: { ...newBooking, seats },
    });
  } catch (err) {
    console.error("❌ [ERROR] createBooking gagal:", err);
    return res.status(500).json({
      success: false,
      message: "❌ Gagal membuat booking",
      error: err.message,
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized (token tidak valid)" });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      seats: JSON.parse(booking.seats),
    }));

    return res.status(200).json({
      success: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("❌ getBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data tiket",
      error: error.message,
    });
  }
};

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
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
    } = req.body;

    if (
      !movieId ||
      !title ||
      !cinema ||
      !date ||
      !time ||
      !seats ||
      seats.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "❌ Data booking tidak lengkap",
      });
    }

    const seatsString = JSON.stringify(seats);

    const duplicate = await prisma.booking.findFirst({
      where: {
        userId,
        movieId,
        date,
        time,
        seats: seatsString,
      },
    });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "❌ Booking dengan detail yang sama sudah ada di keranjang",
      });
    }

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
      },
    });

    return res.status(201).json({
      success: true,
      message: "✅ Booking berhasil ditambahkan ke cart",
      booking: {
        ...newBooking,
        seats, 
      },
    });
  } catch (err) {
    console.error(err);
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
    console.error("❌ Error getUserBookings:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data tiket",
      error: error.message,
    });
  }
};


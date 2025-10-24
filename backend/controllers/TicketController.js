import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addTickets = async (tickets) => {
  try {
    if (!Array.isArray(tickets) || tickets.length === 0) {
      throw new Error("Data tiket tidak valid atau kosong");
    }

    const created = await prisma.booking.createMany({
      data: tickets,
    });

    console.log("✅ Tiket berhasil disimpan:", created);
    return created;
  } catch (err) {
    console.error("❌ Gagal menyimpan tiket:", err);
    throw err;
  }
};

export const addTicketsHandler = async (req, res) => {
  try {
    const tickets = req.body;
    const result = await addTickets(tickets);
    res.status(201).json({
      success: true,
      message: "Tiket berhasil disimpan",
      created: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "❌ Gagal menyimpan tiket ke database",
      error: err.message,
    });
  }
};

export const getTickets = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User belum login",
      });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const tickets = bookings.map((b) => ({
      ...b,
      seats:
        typeof b.seats === "string"
          ? b.seats.split(",").map((s) => s.trim())
          : [],
    }));

    res.json({ success: true, tickets });
  } catch (err) {
    console.error("❌ Gagal mengambil tiket:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil tiket",
    });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Tiket tidak ditemukan",
      });
    }

    const formattedTicket = {
      ...ticket,
      seats:
        typeof ticket.seats === "string"
          ? ticket.seats.split(",").map((s) => s.trim())
          : [],
    };

    res.json({ success: true, ticket: formattedTicket });
  } catch (err) {
    console.error("❌ Gagal mengambil tiket by ID:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil tiket",
    });
  }
};

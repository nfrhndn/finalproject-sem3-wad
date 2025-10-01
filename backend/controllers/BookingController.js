let bookings = [];
let tickets = [];

export const createBooking = (req, res) => {
  try {
    const {
      id,
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

    const duplicate = bookings.find(
      (b) =>
        b.movieId === movieId &&
        b.date === date &&
        b.time === time &&
        JSON.stringify(b.seats) === JSON.stringify(seats)
    );
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "❌ Booking dengan detail yang sama sudah ada di keranjang",
      });
    }

    const newBooking = {
      id: id || Date.now(),
      movieId,
      title,
      poster,
      cinema,
      date,
      time,
      seats,
      price,
      total,
    };

    bookings.push(newBooking);

    res.status(201).json({
      success: true,
      message: "✅ Booking berhasil ditambahkan ke cart",
      booking: newBooking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "❌ Gagal membuat booking",
      error: err.message,
    });
  }
};

export const getBookings = (req, res) => {
  res.json({
    success: true,
    bookings,
  });
};

export const getBookingById = (req, res) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id == id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "❌ Booking tidak ditemukan",
    });
  }

  res.json({
    success: true,
    booking,
  });
};

export const deleteBooking = (req, res) => {
  const { id } = req.params;
  bookings = bookings.filter((b) => b.id != id);

  res.json({
    success: true,
    message: "🗑️ Booking berhasil dihapus dari cart",
    bookings,
  });
};

export const checkoutBooking = (req, res) => {
  try {
    if (bookings.length === 0) {
      return res.status(400).json({
        success: false,
        message: "❌ Keranjang masih kosong",
      });
    }

    const generateBookingCode = (title) =>
      title.toUpperCase().slice(0, 3) +
      Math.floor(100000 + Math.random() * 900000).toString();

    const checkedOutTickets = bookings.map((b) => ({
      ...b,
      bookingCode: generateBookingCode(b.title),
    }));

    tickets.push(...checkedOutTickets);

    bookings = [];

    res.json({
      success: true,
      message: "💳 Checkout berhasil, tiket tersimpan!",
      tickets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "❌ Gagal melakukan checkout",
      error: err.message,
    });
  }
};

export const getTickets = (req, res) => {
  res.json({
    success: true,
    tickets,
  });
};

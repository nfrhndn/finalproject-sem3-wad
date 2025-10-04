import { addTickets } from "./TicketController.js";

let cart = [];

export const addToCart = (req, res) => {
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
      return res
        .status(400)
        .json({ success: false, message: "Data cart tidak lengkap" });
    }

    const newItem = {
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

    cart.push(newItem);
    return res.status(201).json({
      success: true,
      message: "Berhasil ditambahkan ke cart",
      item: newItem,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const getCart = (req, res) => {
  return res.json({ success: true, cart });
};

export const deleteCartItem = (req, res) => {
  const { id } = req.params;
  cart = cart.filter((c) => String(c.id) !== String(id));
  return res.json({ success: true, message: "Item dihapus", cart });
};

export const updateCartItem = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  let index = cart.findIndex((c) => String(c.id) === String(id));
  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Item tidak ditemukan" });
  }

  cart[index] = { ...cart[index], ...updatedData };

  return res.json({
    success: true,
    message: "Item berhasil diperbarui",
    item: cart[index],
    cart,
  });
};

export const clearCart = (req, res) => {
  cart = [];
  return res.json({ success: true, message: "Cart dikosongkan" });
};

export const checkoutCart = (req, res) => {
  try {
    const { items, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "❌ Cart kosong, tidak bisa checkout",
      });
    }

    const ids = items.map((it) =>
      typeof it === "object" && it.id !== undefined ? String(it.id) : String(it)
    );

    const foundInCart = cart.filter((c) => ids.includes(String(c.id)));

    const extras = items
      .filter((it) => typeof it === "object" && it.id !== undefined)
      .filter((it) => !foundInCart.some((f) => String(f.id) === String(it.id)));

    const toCheckout = [...foundInCart, ...extras];

    if (toCheckout.length === 0) {
      return res.status(400).json({
        success: false,
        message: "❌ Item checkout tidak ditemukan di cart",
      });
    }

    const generateBookingCode = (title) =>
      String(title || "TCK")
        .toUpperCase()
        .slice(0, 3) + Math.floor(100000 + Math.random() * 900000).toString();

    const tickets = toCheckout.map((item) => ({
      ...item,
      bookingCode: generateBookingCode(item.title),
      paymentMethod: paymentMethod || null,
      bookedAt: new Date().toISOString(),
    }));

    addTickets(tickets);

    cart = cart.filter((c) => !ids.includes(String(c.id)));

    return res.json({
      success: true,
      message: "✅ Checkout berhasil",
      tickets,
      cart,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "❌ Gagal melakukan checkout",
      error: err.message,
    });
  }
};

import express from "express";
import { authenticate } from "../middleware/auth.js";

import {
  createBooking,
  getBookings,
  // getBookingById,
  // deleteBooking,
  // checkoutBooking,
  // getTickets,
  // addToCart,
  // getCart,
  // removeFromCart,
} from "../controllers/BookingController.js";

const router = express.Router();

router.post("/", authenticate, createBooking);          
router.get("/", authenticate, getBookings);

// router.post("/checkout", authenticate, checkoutBooking);
// router.get("/tickets", authenticate, getTickets);

// router.get("/:id", authenticate, getBookingById);
// router.delete("/:id", authenticate, deleteBooking);

// router.post("/cart", authenticate, addToCart);
// router.get("/cart", authenticate, getCart);
// router.delete("/cart/:id", authenticate, removeFromCart);

export default router;

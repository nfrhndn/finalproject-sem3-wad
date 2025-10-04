import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking,
  checkoutBooking,
  getTickets,
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/BookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);

router.post("/checkout", checkoutBooking);
router.get("/tickets", getTickets);

router.get("/:id", getBookingById);
router.delete("/:id", deleteBooking);

router.post("/cart", addToCart);
router.get("/cart", getCart);
router.delete("/cart/:id", removeFromCart);

export default router;

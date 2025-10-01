import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking,
  checkoutBooking,
  getTickets,
} from "../controllers/BookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);

router.post("/checkout", checkoutBooking);
router.get("/tickets", getTickets);

router.get("/:id", getBookingById);
router.delete("/:id", deleteBooking);

export default router;

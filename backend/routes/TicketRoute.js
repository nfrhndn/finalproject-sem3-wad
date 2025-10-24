import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getTickets,
  getTicketById,
  addTickets,
} from "../controllers/TicketController.js";

const router = express.Router();

router.use(authenticate);
router.get("/", authenticate, getTickets);
router.get("/:id", authenticate, getTicketById);
router.post("/", addTickets);

export default router;

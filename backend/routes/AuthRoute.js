import express from "express";
import { register, login, verifyToken } from "../controllers/AuthController.js";
import { authenticate } from "../middleware/Auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/verify", authenticate, verifyToken);

export default router;

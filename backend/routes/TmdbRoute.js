import express from "express";
import { importFromTMDB } from "../controllers/TmdbController.js";
import { verifyToken, verifyAdmin } from "../middleware/Auth.js";

const router = express.Router();

router.post("/import", verifyToken, verifyAdmin, importFromTMDB);

export default router;

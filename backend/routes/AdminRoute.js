import express from "express";
import { loginAdmin } from "../controllers/AdminAuthController.js";
import { verifyToken, verifyAdmin } from "../middleware/Auth.js";
import { prisma } from "../lib/prisma.js"; 

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/dashboard", verifyToken, verifyAdmin, async (req, res) => {
    try {
        res.json({
            success: true,
            message: `Selamat datang di halaman admin, ${req.user.email}!`,
            data: {
                role: req.user.role,
                id: req.user.id,
            },
        });
    } catch (error) {
        console.error("🔥 Error di endpoint admin/dashboard:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server admin.",
        });
    }
});


router.get("/movies", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const movies = await prisma.movie.findMany({
            orderBy: { createdAt: "desc" },
            take: 10,
        });

        res.json({
            success: true,
            message: "Berhasil mengambil data film untuk admin.",
            count: movies.length,
            movies,
        });
    } catch (error) {
        console.error("🔥 Error di endpoint admin/movies:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data film.",
        });
    }
});

export default router;

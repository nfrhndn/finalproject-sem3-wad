import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Email tidak valid."),
    password: z.string().min(6, "Password minimal 6 karakter."),
});

function getJwtSecret() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET belum diatur di .env");
    }
    return process.env.JWT_SECRET;
}

export const loginAdmin = async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: parsed.error.issues[0].message,
            });
        }

        const { email, password } = parsed.data;
        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah.",
            });
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah.",
            });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            getJwtSecret(),
            { expiresIn: "4h" }
        );

        res.json({
            success: true,
            message: "Login admin berhasil",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (err) {
        console.error("Login Admin Error:", err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server.",
        });
    }
};

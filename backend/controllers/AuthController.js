import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string({ required_error: "Nama wajib diisi." })
    .min(3, "Nama minimal 3 karakter"),
  email: z
    .string({ required_error: "Email wajib diisi." })
    .email("Format email tidak valid."),
  password: z
    .string({ required_error: "Password wajib diisi." })
    .min(6, "Password minimal 6 karakter."),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi." })
    .email("Format email tidak valid."),
  password: z
    .string({ required_error: "Password wajib diisi." })
    .min(6, "Password minimal 6 karakter."),
});

function getJwtSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return JWT_SECRET;
}

export const register = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0].message,
      });
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const JWT_SECRET = getJwtSecret();
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar || null,
    };

    return res.json({
      success: true,
      message: "Registrasi sukses",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat register.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0].message,
      });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah." });
    }

    const JWT_SECRET = getJwtSecret();
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "2h",
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar || null,
    };

    return res.json({
      success: true,
      message: "Login sukses",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat login.",
    });
  }
};

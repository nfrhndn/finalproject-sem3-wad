import { z } from "zod";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";

const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter").optional(),
  name: z.string().min(2, "Nama minimal 2 karakter").optional(),
  newEmail: z.string().email("Format email tidak valid").optional(),
  email: z.string().email("Format email tidak valid").optional(),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  language: z.string().optional(),
  paymentMethod: z.string().nullable().optional(),
});

console.log("JWT_SECRET (server):", process.env.JWT_SECRET);

export const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Token tidak ditemukan" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: { profile: true },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });

    const { password, ...safeUser } = user;
    return res.json({
      success: true,
      user: {
        ...safeUser,
        avatar: user.profile?.avatar || "",
      },
    });
  } catch (err) {
    console.error("GetProfile error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kadaluarsa",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Token tidak ditemukan" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      const message = parseResult.error.errors[0].message;
      return res.status(400).json({ success: false, message });
    }

    const data = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.fullName || data.name || user.name,
        email: data.newEmail || data.email || user.email,
        password: data.password || user.password,
      },
    });

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        fullName: data.fullName || data.name || updatedUser.name,
        language: data.language || undefined,
        paymentMethod: data.paymentMethod || undefined,
      },
      create: {
        userId: user.id,
        fullName: data.fullName || data.name || updatedUser.name,
        language: data.language || "Bahasa Indonesia",
        paymentMethod: data.paymentMethod || null,
      },
    });

    const { password, ...safeUser } = updatedUser;

    return res.json({
      success: true,
      user: safeUser,
      profile: updatedProfile,
      message: "Profil berhasil diperbarui",
    });
  } catch (err) {
    console.error("UpdateProfile error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File tidak ditemukan",
      });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Hanya file gambar yang diperbolehkan",
      });
    }

    const filePath = `/uploads/avatars/${req.file.filename}`;

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: { avatar: filePath },
      create: {
        userId: user.id,
        fullName: user.name || "",
        avatar: filePath,
        language: "Bahasa Indonesia",
      },
    });

    const { password, ...safeUser } = user;

    return res.json({
      success: true,
      message: "Avatar berhasil diunggah",
      user: {
        ...safeUser,
        avatar: filePath,
      },
      profile,
    });
  } catch (err) {
    console.error("UploadAvatar error:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: err.message,
    });
  }
};

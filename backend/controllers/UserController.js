import jwt from "jsonwebtoken";
import { users } from "./AuthController.js";

export const getProfile = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find((u) => u.email === decoded.email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });
    }

    const { password, ...safe } = user;
    return res.json({ success: true, user: safe });
  } catch (err) {
    console.error("GetProfile error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kadaluarsa",
    });
  }
};

export const updateProfile = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, newEmail, password } = req.body;

    const idx = users.findIndex((u) => u.email === decoded.email);
    if (idx === -1) {
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });
    }

    if (name) users[idx].name = name;
    if (newEmail) users[idx].email = newEmail;
    if (password) users[idx].password = password;

    const { password: pw, ...safe } = users[idx];
    return res.json({
      success: true,
      user: safe,
      message: "Profil berhasil diperbarui",
    });
  } catch (err) {
    console.error("UpdateProfile error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};

export const uploadAvatar = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idx = users.findIndex((u) => u.email === decoded.email);
    if (idx === -1) {
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File tidak ditemukan" });
    }

    users[idx].avatar = `/uploads/${req.file.filename}`;

    const { password, ...safe } = users[idx];
    return res.json({
      success: true,
      user: safe,
      message: "Avatar berhasil diunggah",
    });
  } catch (err) {
    console.error("UploadAvatar error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};

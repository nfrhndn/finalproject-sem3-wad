import jwt from "jsonwebtoken";
import { z } from "zod";

const authHeaderSchema = z
  .string()
  .startsWith("Bearer ", {
    message: "Header Authorization harus dimulai dengan 'Bearer '",
  })
  .min(20, { message: "Token tidak valid atau terlalu pendek" });

function getJwtSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET tidak ditemukan di .env");
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return JWT_SECRET;
}

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🪪 Header Authorization:", authHeader || "❌ Tidak ada header");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Sesi kamu sudah berakhir. Silakan login ulang.",
      });
    }

    const parsedAuth = authHeaderSchema.safeParse(authHeader);
    if (!parsedAuth.success) {
      console.warn("⚠️ Header Authorization tidak valid:", parsedAuth.error);
      return res.status(401).json({
        success: false,
        message: "Sesi kamu sudah berakhir. Silakan login ulang.",
      });
    }

    const token = parsedAuth.data.split(" ")[1];
    const JWT_SECRET = getJwtSecret();

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.warn("⚠️ JWT Verification Error:", err.name);

        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Sesi kamu sudah berakhir. Silakan login ulang.",
          });
        }

        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({
            success: false,
            message: "Token tidak valid. Silakan login ulang.",
          });
        }

        return res.status(401).json({
          success: false,
          message: "Sesi kamu sudah berakhir. Silakan login ulang.",
        });
      }

      console.log("✅ Token valid. User:", decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("🔥 Auth Middleware Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat memverifikasi token.",
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang dapat mengakses fitur ini.",
    });
  }
  next();
};

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

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.warn("⚠️ Tidak ada header Authorization");
      return res.status(401).json({
        success: false,
        message: "Sesi kamu sudah berakhir. Silakan login ulang.",
      });
    }

    const parsedAuth = authHeaderSchema.safeParse(authHeader);
    if (!parsedAuth.success) {
      console.warn("⚠️ Header Authorization tidak valid");
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau format salah.",
      });
    }

    const token = parsedAuth.data.split(" ")[1];
    const JWT_SECRET = getJwtSecret();

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("🔥 Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Sesi kamu sudah berakhir. Silakan login ulang."
          : "Token tidak valid. Silakan login ulang.",
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role?.toUpperCase() !== "ADMIN") {
    console.warn("⚠️ Akses ditolak, bukan admin:", req.user);
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang dapat mengakses fitur ini.",
    });
  }
  next();
};

export const authenticate = verifyToken;
export const authorizeAdmin = verifyAdmin;

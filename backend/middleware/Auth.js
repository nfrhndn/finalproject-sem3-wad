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
      console.warn(
        "⚠️ Header Authorization tidak valid:",
        parsedAuth.error.format()
      );
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
        const message =
          err.name === "TokenExpiredError"
            ? "Sesi kamu sudah berakhir. Silakan login ulang."
            : "Token tidak valid. Silakan login ulang.";

        return res.status(401).json({ success: false, message });
      }

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

export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role?.toLowerCase() !== "admin") {
    console.warn("⚠️ Akses ditolak, bukan admin:", req.user);
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang dapat mengakses fitur ini.",
    });
  }
  next();
};

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Akses ditolak. Hanya admin yang bisa melakukan ini." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ verifyAdminToken error:", err.message);
    return res.status(401).json({ error: "Token tidak valid" });
  }
};

export const authenticate = verifyToken;
export const authorizeAdmin = verifyAdmin;

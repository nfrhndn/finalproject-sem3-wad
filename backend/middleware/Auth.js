import jwt from "jsonwebtoken";
import { z } from "zod";

const authHeaderSchema = z
  .string()
  .startsWith("Bearer ", {
    message: "Header Authorization harus dimulai dengan 'Bearer '",
  })
  .min(10, { message: "Token terlalu pendek" });

function getJwtSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return JWT_SECRET;
}

export const authenticate = (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    const parsedAuth = authHeaderSchema.safeParse(auth);
    if (!parsedAuth.success) {
      return res.status(401).json({
        success: false,
        message:
          parsedAuth.error.issues[0].message ||
          "Header Authorization tidak valid",
      });
    }

    const token = parsedAuth.data.split(" ")[1];
    const JWT_SECRET = getJwtSecret();

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token tidak valid atau sudah kadaluarsa",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server (auth middleware)",
    });
  }
};

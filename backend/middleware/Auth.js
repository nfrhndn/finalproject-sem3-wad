import jwt from "jsonwebtoken";

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
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = auth.split(" ")[1];
    const JWT_SECRET = getJwtSecret();

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

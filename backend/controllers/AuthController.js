import jwt from "jsonwebtoken";

function getJwtSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return JWT_SECRET;
}

export let users = [
  {
    id: 1,
    email: "budi@gmail.com",
    password: "123456",
    name: "Budi Santoso",
    avatar: null,
  },
  {
    id: 2,
    email: "ahmad@gmail.com",
    password: "ahmadmamad",
    name: "Ahmad Mamad",
    avatar: null,
  },
];

export const login = (req, res) => {
  console.log("🟢 BODY:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password wajib diisi.",
    });
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Email atau password salah.",
    });
  }

  const JWT_SECRET = getJwtSecret();

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "2h",
  });

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };

  return res.json({
    success: true,
    message: "Login sukses",
    token,
    user: safeUser,
  });
};

export const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Semua field wajib diisi.",
    });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Email sudah terdaftar.",
    });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    avatar: null,
  };
  users.push(newUser);

  const safeUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    avatar: null,
  };

  const JWT_SECRET = getJwtSecret();

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
    expiresIn: "2h",
  });

  return res.json({
    success: true,
    message: "Registrasi sukses",
    token,
    user: safeUser,
  });
};

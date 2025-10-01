const users = [
  { id: 1, email: "budi@gmail.com", password: "123456", name: "Budi Santoso" },
  {
    id: 2,
    email: "ahamad@gmail.com",
    password: "ahmadmamad",
    name: "Ahmad Mamad",
  },
];

export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password dibutuhkan." });
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Email atau password salah." });
  }

  const safeUser = { id: user.id, email: user.email, name: user.name };
  res.json({ message: "Login sukses", user: safeUser });
};

export const register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Semua field wajib diisi." });
  }
  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "Email sudah terdaftar." });
  }
  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  const safeUser = { id: newUser.id, email: newUser.email, name: newUser.name };
  res.json({ message: "Registrasi sukses", user: safeUser });
};

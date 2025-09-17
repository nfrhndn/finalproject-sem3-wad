import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./authpage.css";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
    setFullName("");
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password || (isRegister && !fullName)) {
      setError("⚠️ Semua field wajib diisi!");
      return;
    }

    setError("");

    if (isRegister) {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

      const existingUser = storedUsers.find((u: any) => u.email === email);
      if (existingUser) {
        setError("⚠️ Email sudah terdaftar!");
        return;
      }

      const newUser = { fullName, email, password };
      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));

      setIsRegister(false);
      setEmail("");
      setPassword("");
      setFullName("");

      alert("✅ Akun berhasil dibuat! Silakan login.");
    } else {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

      const user = storedUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));

        setEmail("");
        setPassword("");
        setFullName("");

        navigate("/dashboard");
      } else {
        setError("❌ Email atau password salah!");
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isRegister ? "Daftar Akun" : "Login Akun"}
        </h2>
        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          {isRegister && (
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="auth-input"
              required
              autoComplete="off"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
            autoComplete="off"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
            autoComplete="new-password"
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button">
            {isRegister ? "Daftar" : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Daftar"}
          </span>
        </p>
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  email: string;
  name: string;
  role?: string;
  avatar?: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔁 Load user & token saat app mulai
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedAdminToken = localStorage.getItem("adminToken");
      const savedUserToken = localStorage.getItem("userToken");
      const activeToken = savedAdminToken || savedUserToken;

      if (savedUser && activeToken) {
        setUser(JSON.parse(savedUser));
        setToken(activeToken);
      }
    } catch (err) {
      console.error("❌ Gagal parse data user:", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // 💾 Sync user ke localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // 💾 Sync token ke localStorage
  useEffect(() => {
    if (token) {
      const isAdmin = user?.role?.toLowerCase() === "admin";
      if (isAdmin) {
        localStorage.setItem("adminToken", token);
        localStorage.removeItem("userToken");
      } else {
        localStorage.setItem("userToken", token);
        localStorage.removeItem("adminToken");
      }
    } else {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("userToken");
    }
  }, [token, user]);

  // ✅ AUTO LOGOUT jika server backend mati
  useEffect(() => {
    if (!token) return;

    const checkServerConnection = async () => {
      try {
        const res = await fetch(`${API_URL}/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Kalau server tidak membalas atau status 401 → logout otomatis
        if (!res.ok) {
          console.warn("⚠️ Token invalid atau server tidak aktif");
          logout();
        }
      } catch (error) {
        console.error("❌ Gagal menghubungi server:", error);
        logout(); // server mati → auto logout
      }
    };

    // Jalankan sekali saat mount
    checkServerConnection();

    // Ulangi cek setiap 2 menit
    const interval = setInterval(checkServerConnection, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Jika server mati / tidak bisa diakses
      if (!res.ok && res.status === 0) {
        throw new Error("Server tidak dapat dijangkau.");
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login gagal, periksa email/password");
      }

      const userData: User = data.user;
      const receivedToken: string = data.token;

      setUser(userData);
      setToken(receivedToken);

      const isAdmin = userData.role?.toLowerCase() === "admin";

      localStorage.setItem("user", JSON.stringify(userData));
      if (isAdmin) {
        localStorage.setItem("adminToken", receivedToken);
        localStorage.removeItem("userToken");
        navigate("/admin");
      } else {
        localStorage.setItem("userToken", receivedToken);
        localStorage.removeItem("adminToken");
        navigate("/");
      }

      return { user: userData, token: receivedToken };
    } catch (error: any) {
      console.error("❌ Error login:", error);
      throw new Error(error.message || "Gagal login: server tidak tersedia");
    }
  };

  // 📝 REGISTER
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok && res.status === 0) {
        throw new Error("Server tidak dapat dijangkau.");
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registrasi gagal");
      }

      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error: any) {
      console.error("❌ Error register:", error);
      throw new Error(error.message || "Terjadi kesalahan server saat registrasi");
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

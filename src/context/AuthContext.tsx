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

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const savedToken =
          localStorage.getItem("adminToken") ||
          localStorage.getItem("userToken") ||
          localStorage.getItem("token");

        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser);

          const res = await fetch(`${API_URL}/verify`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setUser(data.user);
              localStorage.setItem("user", JSON.stringify(data.user));
              console.log("✅ Session disinkronkan:", data.user);
            } else {
              setUser(parsedUser);
              console.warn("⚠️ Backend tidak kirim user baru, pakai localStorage.");
            }
          } else {
            console.warn("⚠️ Token invalid, logout otomatis.");
            logout();
            return;
          }

          setToken(savedToken);
        } else {
          console.warn("⚠️ Tidak ada sesi tersimpan.");
          localStorage.clear();
        }
      } catch (err) {
        console.error("❌ Gagal memuat sesi:", err);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Login gagal");

      const userData: User = data.user;
      const receivedToken: string = data.token;

      setUser(userData);
      setToken(receivedToken);

      const isAdmin = userData.role?.toLowerCase() === "admin";
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem(isAdmin ? "adminToken" : "userToken", receivedToken);
      localStorage.setItem("token", receivedToken);

      console.log("✅ Login sukses:", userData);

      return { user: userData, token: receivedToken };
    } catch (error: any) {
      console.error("❌ Error login:", error);
      throw new Error(error.message || "Gagal login");
    }
  };


  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Registrasi gagal");

      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error: any) {
      console.error("❌ Error register:", error);
      throw new Error(error.message || "Terjadi kesalahan server saat registrasi");
    }
  };

  const logout = () => {
    console.log("🚪 Logout: session dibersihkan");
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {!loading ? children : <div className="text-center p-6">Loading session...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

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
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User; token: string }>;
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
    const loadAuthData = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const savedAdminToken = localStorage.getItem("adminToken");
        const savedUserToken = localStorage.getItem("userToken");
        const savedToken = localStorage.getItem("token");

        const activeToken =
          savedAdminToken || savedUserToken || savedToken || null;

        if (savedUser && activeToken) {
          setUser(JSON.parse(savedUser));
          setToken(activeToken);

          localStorage.setItem("token", activeToken);

          console.log("✅ Session dimuat:", {
            user: JSON.parse(savedUser),
            activeToken,
          });
        } else {
          console.warn("⚠️ Tidak ada sesi tersimpan, user belum login.");
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("❌ Gagal parse data auth:", err);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (token) {
      const isAdmin = user.role?.toLowerCase() === "admin";
      if (isAdmin) {
        localStorage.setItem("adminToken", token);
        localStorage.removeItem("userToken");
      } else {
        localStorage.setItem("userToken", token);
        localStorage.removeItem("adminToken");
      }

      localStorage.setItem("token", token);

      console.log("💾 Token disimpan:", token);
    }
  }, [token, user]);

  useEffect(() => {
    if (!token) return;
    let retryCount = 0;

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_URL}/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          retryCount++;
          console.warn(`⚠️ Token invalid (percobaan ${retryCount})`);
          if (retryCount >= 2) logout();
        } else if (res.ok) {
          retryCount = 0;
        }
      } catch (error) {
        console.error(
          "⚠️ Gagal menghubungi server untuk verifikasi token:",
          error
        );
      }
    };

    verifyToken();
    const interval = setInterval(verifyToken, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success)
        throw new Error(data.message || "Login gagal");

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

      localStorage.setItem("token", receivedToken);

      console.log("✅ Login sukses:", userData);
      return { user: userData, token: receivedToken };
    } catch (error: any) {
      console.error("❌ Error login:", error);
      throw new Error(error.message || "Gagal login: server tidak tersedia");
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
      if (!res.ok || !data.success)
        throw new Error(data.message || "Registrasi gagal");

      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error: any) {
      console.error("❌ Error register:", error);
      throw new Error(
        error.message || "Terjadi kesalahan server saat registrasi"
      );
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
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, setUser }}
    >
      {!loading ? (
        children
      ) : (
        <div className="text-center p-6">Loading session...</div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "../Services/api";

type User = {
  id: number;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved) as User;

      const validateUser = async () => {
        try {
          const res = await fetch("http://localhost:5000/");
          if (!res.ok) throw new Error("Backend tidak bisa diakses");
          setUser(parsed); 
        } catch (err) {
          console.error("❌ Auto logout karena backend mati atau invalid user");
          logout(); 
        }
      };

      validateUser();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await loginApi(email, password);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/");
    } catch (err) {
      throw new Error("Email atau password salah, atau akun belum terdaftar.");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    await registerApi(name, email, password);
    navigate("/login"); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

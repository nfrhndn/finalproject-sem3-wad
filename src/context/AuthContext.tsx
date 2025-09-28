import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const res = await loginApi(email, password);
      setUser(res.user);
      navigate("/");
    } catch (error: any) {
      console.error("❌ Login gagal:", error);
      alert(error.message || "Login gagal, coba lagi");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await registerApi(name, email, password);
      console.log("✅ Registered:", res);
      alert("Registrasi sukses, silakan login");
      navigate("/login");
    } catch (error: any) {
      console.error("❌ Register gagal:", error);
      alert(error.message || "Register gagal, coba lagi");
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

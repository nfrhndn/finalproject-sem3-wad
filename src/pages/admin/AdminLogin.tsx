// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Email dan password wajib diisi!");
            return;
        }

        try {
            // ✅ Login admin dan simpan token ke localStorage
            const response = await login(email, password);

            // Pastikan token dari backend ada
            if (response?.token) {
                // Simpan juga dengan key 'adminToken' agar dikenali adminApi.ts
                localStorage.setItem("adminToken", response.token);
            }

            // 🔒 Arahkan ke dashboard admin
            navigate("/admin");
            setError(null);
        } catch (err: any) {
            setError(err.message || "Login admin gagal, coba lagi.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-indigo-800">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                        <ShieldCheck className="h-10 w-10 text-indigo-600" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Login Admin
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Khusus untuk administrator CinemaPlus
                </p>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@cinemaplus.com"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 transition-all"
                    >
                        Masuk sebagai Admin
                    </button>
                </form>
            </div>
        </div>
    );
}

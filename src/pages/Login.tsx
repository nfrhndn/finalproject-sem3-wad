import { useState } from "react";
import { Eye, EyeOff, Film } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type SimpleUser = {
  id?: number;
  name?: string;
  role?: string;
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [loggedUser, setLoggedUser] = useState<SimpleUser | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan password tidak boleh kosong!");
      return;
    }

    try {
      const result = await login(email, password);
      setLoggedUser(result.user ?? null);
      setError(null);
      setShowRolePopup(true);
    } catch (err: any) {
      setError(err.message || "Login gagal, coba lagi.");
    }
  };

  const handleRoleSelect = (role: string) => {
    setShowRolePopup(false);

    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const firstName = loggedUser?.name ? loggedUser.name.split(" ")[0] : "Teman";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 relative">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-sky-100 p-4 rounded-full">
            <Film className="h-10 w-10 text-sky-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Masuk ke CinemaPlus
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Masuk ke akun Anda untuk menikmati pengalaman menonton terbaik
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
              placeholder="user@cinemaplus.com"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-sky-400 focus:outline-none"
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
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition-all"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-sky-600 font-medium hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>


      {showRolePopup && loggedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-96 text-center scale-100 transition-all duration-200 ease-out">

            <button
              onClick={() => setShowRolePopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close popup"
            >
              ✕
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Halo, {firstName} 👋
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Pilih peran untuk melanjutkan:
              </p>
            </div>

            {loggedUser.role === "ADMIN" ? (
              <button
                onClick={() => handleRoleSelect("ADMIN")}
                className="block w-full py-3 mt-4 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all"
              >
                Masuk sebagai Admin
              </button>
            ) : (
              <button
                onClick={() => handleRoleSelect("USER")}
                className="block w-full py-3 mt-4 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 active:scale-[0.98] transition-all"
              >
                Masuk sebagai Pengguna
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

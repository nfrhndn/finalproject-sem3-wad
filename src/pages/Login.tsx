import { useState } from "react";
import { Eye, EyeOff, Film } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-sky-100 p-4 rounded-full">
                        <Film className="h-10 w-10 text-sky-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Masuk ke CinemaPlus
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Masuk ke akun Anda untuk menikmati pengalaman menonton terbaik
                </p>

                {/* Form */}
                <form className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="user@cinemaplus.com"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-sky-400 focus:outline-none"
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

                    {/* Button Masuk */}
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-gray-600 transition-all"
                    >
                        Masuk
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Belum punya akun?{" "}
                    <Link to="/register" className="text-sky-600 font-medium hover:underline">
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
}

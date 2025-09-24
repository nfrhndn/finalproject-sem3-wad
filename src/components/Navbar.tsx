import { ShoppingCart, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    const menuItems = [
        { name: "Beranda", path: "/" },
        { name: "Pilih Kursi", path: "/pilih-kursi" },
        { name: "Kontak", path: "/kontak" },
    ];

    return (
        <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
            {/* Logo */}
            <div className="text-2xl font-bold text-cyan-600">CinemaPlus</div>

            {/* Menu Tengah */}
            <div className="flex space-x-6">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `relative px-4 py-2 rounded-lg font-medium transition-all duration-300
                            ${isActive
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                                : "text-gray-700 hover:bg-gradient-to-r from-cyan-500 to-blue-600 hover:text-white"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>

            {/* Icon + Button */}
            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r from-cyan-500 to-blue-600 hover:text-white">
                    <ShoppingCart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r from-cyan-500 to-blue-600 hover:text-white">
                    <User className="w-5 h-5" />
                </button>

                {/* Tombol Masuk */}
                <Link
                    to="/login"
                    className="px-5 py-2 rounded-lg border border-cyan-500 bg-white text-cyan-600 font-semibold
                               hover:bg-gradient-to-r from-cyan-500 to-blue-600 hover:text-white transition-all duration-300"
                >
                    Masuk
                </Link>

                {/* Tombol Daftar */}
                <Link
                    to="/register"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold
                               hover:opacity-90 transition-all duration-300"
                >
                    Daftar
                </Link>
            </div>
        </nav>
    );
}

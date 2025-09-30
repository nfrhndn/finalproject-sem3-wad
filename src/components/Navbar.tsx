import { ShoppingCart, User, Ticket } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { name: "Beranda", path: "/" },
    { name: "Film", path: "/film" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 shadow-md bg-white">
      <div className="text-2xl font-bold text-cyan-600">CinemaPlus</div>

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

      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg border border-cyan-500 bg-white text-cyan-600 font-semibold
              hover:bg-gradient-to-r from-cyan-500 to-blue-600 hover:text-white transition-all duration-300"
            >
              Masuk
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold
              hover:opacity-90 transition-all duration-300"
            >
              Daftar
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/cart"
              className="p-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r from-cyan-500 to-blue-600 hover:text-white"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="p-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r from-cyan-500 to-blue-600 hover:text-white flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">
                  {user.name}
                </span>
              </button>

              {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Profil Saya
                  </Link>
                    <Link
                      to="/tiket"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      <Ticket className="w-4 h-4" /> Tiket Saya
                    </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

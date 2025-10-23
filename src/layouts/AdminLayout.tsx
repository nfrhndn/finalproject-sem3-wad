import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Film, Users, Ticket, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { name: "Film", icon: Film, path: "/admin/movies" },
        { name: "Tiket", icon: Ticket, path: "/admin/tickets" },
        { name: "Pengguna", icon: Users, path: "/admin/users" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed left-0 top-0 bottom-0">
                <div className="p-6 text-xl font-bold text-cyan-400">
                    CinemaPlus Admin
                </div>

                <nav className="flex-1 space-y-1 px-3">
                    {menuItems.map(({ name, icon: Icon, path }) => (
                        <NavLink
                            key={name}
                            to={path}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${isActive
                                    ? "bg-cyan-600 text-white"
                                    : "text-gray-300 hover:bg-cyan-700 hover:text-white"
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {name}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="ml-64 flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100"
                        >
                            <img
                                src={
                                    user?.avatar
                                        ? user.avatar.startsWith("http")
                                            ? user.avatar
                                            : `${window.BASE_URL?.replace("/api", "")}${user.avatar}`
                                        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover border border-gray-300"
                            />
                            <span className="text-gray-700 font-medium">
                                {user?.name || "Admin"}
                            </span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200">
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-cyan-100 transition"
                                >
                                    Profil Saya
                                </button>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition"
                                >
                                    Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

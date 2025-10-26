import {
    Film,
    Users,
    Ticket,
    LayoutDashboard,
    Globe,
    SquareChevronLeft,
    SquareChevronRight,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
        <div className="flex min-h-screen bg-gray-100 transition-all duration-300">
            <aside
                className={`${sidebarOpen ? "w-64" : "w-20"
                    } bg-[#0f172a] text-white flex flex-col fixed left-0 top-0 bottom-0 transition-all duration-300`}
            >
                <div className="p-6 flex items-center justify-between">
                    <div
                        className={`text-xl font-bold text-cyan-400 transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                    >
                        CinemaPlus Admin
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-3 mt-2">
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
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span
                                className={`transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                                    }`}
                            >
                                {name}
                            </span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"
                    }`}
            >
                <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            className="p-2 rounded hover:bg-cyan-100 text-gray-600 hover:text-cyan-600 transition"
                        >
                            {sidebarOpen ? (
                                <SquareChevronLeft className="w-6 h-6" />
                            ) : (
                                <SquareChevronRight className="w-6 h-6" />
                            )}
                        </button>

                        <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
                    </div>

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
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate("/");
                                    }}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-cyan-100 transition text-sm"
                                >
                                    <Globe className="w-4 h-4 text-cyan-600" />
                                    Web User
                                </button>

                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition text-sm"
                                >
                                    Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

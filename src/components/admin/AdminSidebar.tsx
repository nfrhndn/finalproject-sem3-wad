import { Film, Ticket, Users, Tag, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Film", icon: Film, path: "/admin/movies" },
    { name: "Tiket", icon: Ticket, path: "/admin/tickets" },
    { name: "Pengguna", icon: Users, path: "/admin/users" },
    { name: "Promo", icon: Tag, path: "/admin/promos" },
];

export default function AdminSidebar() {
    const location = useLocation();
    return (
        <aside className="w-64 bg-[#0f172a] text-white h-screen p-4 fixed">
            <h1 className="text-2xl font-bold mb-8 text-cyan-400">CinemaPlus Admin</h1>
            <nav className="flex flex-col gap-3">
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
                                ? "bg-cyan-600 text-white"
                                : "hover:bg-cyan-800 text-gray-300"
                                }`}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

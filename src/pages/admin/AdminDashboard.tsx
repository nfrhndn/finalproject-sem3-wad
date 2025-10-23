import { Film, Ticket, Users, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        {
            icon: <Film className="w-6 h-6 text-cyan-600" />,
            label: "Total Film",
            value: "42",
            growth: "+12% dari bulan lalu",
        },
        {
            icon: <Ticket className="w-6 h-6 text-cyan-600" />,
            label: "Tiket Terjual",
            value: "1,247",
            growth: "+23% dari bulan lalu",
        },
        {
            icon: <Users className="w-6 h-6 text-cyan-600" />,
            label: "Total Pengguna",
            value: "892",
            growth: "+8% dari bulan lalu",
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-cyan-600" />,
            label: "Revenue",
            value: "Rp 45.2M",
            growth: "+18% dari bulan lalu",
        },
    ];

    const popularMovies = [
        { title: "Pengabdi Setan 2", viewers: "2,453 penonton" },
        { title: "KKN di Desa Penari", viewers: "2,121 penonton" },
        { title: "Dilan 1991", viewers: "1,892 penonton" },
        { title: "Miracle in Cell No. 7", viewers: "1,654 penonton" },
    ];

    const promos = [
        { name: "Weekend Special", off: "25% OFF" },
        { name: "Student Discount", off: "15% OFF" },
        { name: "Early Bird", off: "30% OFF" },
        { name: "Member Exclusive", off: "20% OFF" },
    ];

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Selamat datang di Cinema Admin Panel
                </p>
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow p-5 flex items-center justify-between hover:shadow-md transition"
                    >
                        <div>
                            <div className="flex items-center gap-2 text-gray-700 font-semibold">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            <div className="mt-3 text-2xl font-bold text-gray-800">
                                {item.value}
                            </div>
                            <div className="text-green-500 text-sm mt-1">
                                {item.growth}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Film & Promo Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Film Terpopuler */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Film Terpopuler
                    </h2>
                    <ul className="divide-y divide-gray-100">
                        {popularMovies.map((movie, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center py-3"
                            >
                                <div>
                                    <p className="text-gray-800 font-medium">{movie.title}</p>
                                    <p className="text-gray-500 text-sm">{movie.viewers}</p>
                                </div>
                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-cyan-100 text-cyan-600 text-sm font-semibold">
                                    {index + 1}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Promo Aktif */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Promo Aktif
                    </h2>
                    <ul className="space-y-3">
                        {promos.map((promo, idx) => (
                            <li
                                key={idx}
                                className="flex justify-between items-center border-b border-gray-100 pb-2"
                            >
                                <div>
                                    <p className="text-gray-800 font-medium">{promo.name}</p>
                                    <p className="text-red-500 text-sm">{promo.off}</p>
                                </div>
                                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                                    Aktif
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

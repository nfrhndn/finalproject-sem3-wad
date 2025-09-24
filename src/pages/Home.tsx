import { Film, Clock } from "lucide-react";

const Home = () => {
    return (
        <main className="flex-1 max-w-7xl mx-auto px-6 py-10 space-y-14">
            {/* HERO */}
            <section className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-center py-16 rounded-xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Selamat Datang di <span className="text-white">CinemaPlus</span>
                </h1>
                <p className="mb-6">
                    Nikmati pengalaman menonton terbaik dengan teknologi cinema terdepan
                    dan layanan premium
                </p>
                <button className="bg-white text-sky-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100">
                    Pesan Tiket Sekarang
                </button>
            </section>

            {/* FILM POPULER */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-sky-600">Film Populer</h2>
                    <a href="#" className="text-sky-500 font-medium">
                        Lihat Semua
                    </a>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Spider-Man: No Way Home",
                            genre: "Action, Adventure",
                            durasi: "148 min",
                        },
                        {
                            title: "Top Gun: Maverick",
                            genre: "Action, Drama",
                            durasi: "130 min",
                        },
                        {
                            title: "Avatar: The Way of Water",
                            genre: "Sci-Fi, Adventure",
                            durasi: "192 min",
                        },
                    ].map((film, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg mb-4">
                                <Film className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="font-bold text-lg">{film.title}</h3>
                            <p className="text-sm text-gray-600">{film.genre}</p>
                            <div className="flex justify-between items-center mt-3 text-sm">
                                <span className="flex items-center space-x-1 text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>{film.durasi}</span>
                                </span>
                                <button className="px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                                    Pesan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Home;

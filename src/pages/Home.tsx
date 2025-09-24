import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";
import CinemaCard from "../components/CinemaCard";
import ScheduleCard from "../components/ScheduleCard";

const Home = () => {
    return (
        <div>
            <Hero />

            {/* Film Populer */}
            <section className="container mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Film Populer</h2>
                    <button className="text-cyan-600 hover:underline">Lihat Semua</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MovieCard
                        title="Spider-Man: No Way Home"
                        genre="Action, Adventure"
                        description="Peter Parker menghadapi konsekuensi dari identitasnya yang terbongkar sebagai Spider-Man."
                        duration="148 min"
                        rating={8.4}
                    />
                    <MovieCard
                        title="Top Gun: Maverick"
                        genre="Action, Drama"
                        description="Pete 'Maverick' Mitchell kembali sebagai instruktur pilot terbaik dengan misi berbahaya."
                        duration="130 min"
                        rating={8.7}
                    />
                    <MovieCard
                        title="Avatar: The Way of Water"
                        genre="Sci-Fi, Adventure"
                        description="Jake Sully dan keluarganya melindungi planet Pandora dari ancaman baru."
                        duration="192 min"
                        rating={7.9}
                    />
                </div>
            </section>

            {/* Lokasi Bioskop */}
            <section className="container mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold mb-6">Lokasi Bioskop</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CinemaCard
                        name="Cinema XXI Plaza Senayan"
                        location="Jakarta Selatan"
                        studio="8 studio"
                        facilities={["IMAX", "Dolby Atmos", "4DX"]}
                    />
                    <CinemaCard
                        name="Cinema XXI Grand Indonesia"
                        location="Jakarta Pusat"
                        studio="12 studio"
                        facilities={["IMAX", "Dolby Atmos", "VIP"]}
                    />
                    <CinemaCard
                        name="Cinema XXI Pacific Place"
                        location="Jakarta Selatan"
                        studio="6 studio"
                        facilities={["Dolby Atmos", "VIP"]}
                    />
                </div>
            </section>

            {/* Sedang Tayang */}
            <section className="container mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold mb-6">Sedang Tayang</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ScheduleCard title="Fast X" times={["13:30", "16:00", "19:30", "22:00"]} />
                    <ScheduleCard title="John Wick: Chapter 4" times={["14:00", "17:30", "21:00"]} />
                    <ScheduleCard title="The Little Mermaid" times={["12:00", "15:30", "18:00", "20:30"]} />
                </div>
            </section>
        </div>
    );
};

export default Home;

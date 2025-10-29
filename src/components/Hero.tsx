import { useEffect, useState } from "react";
import { Star, Clock, Film, Ticket, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TrailerModal from "./TrailerModal";

const BASE_URL = "http://localhost:5000/api/movies";

interface Movie {
  id: number;
  tmdbId?: number;
  title: string;
  description?: string;
  duration?: number;
  genres?: { genre: { name: string } }[];
  posterUrl?: string;
  backdropUrl?: string;
  rating?: number;
  trailerUrl?: string;
}

const Hero: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await fetch(`${BASE_URL}/published`);
        if (!res.ok) throw new Error("Gagal fetch film dari backend");

        const data = await res.json();
        // Batasi hanya 6 film untuk Hero
        setMovies(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (error) {
        console.error("❌ Gagal mengambil data film:", error);
      }
    };

    loadMovies();
  }, []);

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}j ${m}m`;
  };

  const handlePesan = (movie: Movie) => {
    if (!user) {
      navigate("/login");
    } else {
      localStorage.setItem("selectedMovie", JSON.stringify(movie));
      navigate(`/checkout/${movie.tmdbId || movie.id}`);
    }
  };

  const handleTrailer = (movie: Movie) => {
    if (movie.trailerUrl) {
      const match = movie.trailerUrl.match(/v=([^&]+)/);
      if (match && match[1]) {
        setSelectedTrailer(match[1]);
      } else {
        alert("Trailer tidak tersedia.");
      }
    } else {
      alert("Trailer tidak tersedia.");
    }
  };

  return (
    <section className="relative w-[95%] mx-auto h-[70vh] md:h-[75vh] rounded-3xl overflow-hidden my-6 shadow-xl">
      <Swiper
        modules={[Autoplay, Navigation]}
        navigation={{
          nextEl: ".hero-button-next",
          prevEl: ".hero-button-prev",
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={movies.length > 3}
        className="h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full flex items-center justify-start bg-gradient-to-r from-cyan-800 to-gray-900">
              <div
                className="absolute inset-0 bg-cover bg-center md:bg-top transition-transform duration-700"
                style={{
                  backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
                  filter: "brightness(0.45)",
                  backgroundSize: "cover",
                }}
              ></div>


              <div className="relative z-10 max-w-2xl text-white px-10 md:px-20 overflow-y-auto max-h-[65vh]">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {movie.title}
                </h1>

                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="flex items-center bg-cyan-600 px-2 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                  </div>
                  <div className="flex items-center bg-white/20 px-2 py-1 rounded-full text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(movie.duration)}
                  </div>
                  <div className="flex items-center bg-white/20 px-2 py-1 rounded-full text-sm">
                    <Film className="w-4 h-4 mr-1" />
                    {movie.genres && movie.genres.length > 0
                      ? movie.genres
                        .map((g) => g.genre.name)
                        .slice(0, 2)
                        .join(", ")
                      : "Tanpa Genre"}
                  </div>
                </div>

                <p className="text-gray-200 mb-6 text-sm md:text-base whitespace-pre-line">
                  {movie.description || "Sinopsis tidak tersedia."}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => handlePesan(movie)}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-2 rounded-lg"
                  >
                    <Ticket className="w-5 h-5" /> Beli Tiket
                  </button>

                  <button
                    onClick={() => handleTrailer(movie)}
                    className="flex items-center gap-2 bg-white/30 hover:bg-white/50 text-white font-semibold px-5 py-2 rounded-lg"
                  >
                    <Play className="w-5 h-5" /> Lihat Trailer
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="hero-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button className="hero-button-next absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {selectedTrailer && (
        <TrailerModal
          trailerKey={selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
        />
      )}
    </section>
  );
};

export default Hero;

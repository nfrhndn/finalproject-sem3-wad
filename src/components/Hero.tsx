import { useEffect, useState } from "react";
import { Star, Clock, Film, Ticket, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { fetchPopularMovies, fetchMovieDetail } from "../Services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TrailerModal from "./TrailerModal";

const Hero: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchPopularMovies();
        const uniqueGenres: any[] = [];
        const uniqueMovies = data.results.filter((movie: any) => {
          if (!movie.genre_ids) return false;
          const genre = movie.genre_ids[0];
          if (uniqueGenres.includes(genre)) return false;
          uniqueGenres.push(genre);
          return true;
        });
        const movieDetails = await Promise.all(
          uniqueMovies.slice(0, 5).map(async (m: any) => {
            const detail = await fetchMovieDetail(m.id);
            return { ...m, detail };
          })
        );
        setMovies(movieDetails);
      } catch (error) {
        console.error("Gagal mengambil data film:", error);
      }
    };
    loadMovies();
  }, []);

  const formatDuration = (minutes: number) => {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const handlePesan = (id: number) => {
    if (!user) navigate("/login");
    else navigate(`/checkout/${id}`);
  };

  const handleTrailer = (movie: any) => {
    const videos = movie.detail?.videos?.results || [];
    const youtubeTrailer = videos.find(
      (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
    );
    if (youtubeTrailer) setSelectedTrailer(youtubeTrailer.key);
    else alert("Trailer tidak tersedia.");
  };

  return (
    <section className="relative w-[95%] mx-auto h-[70vh] rounded-3xl overflow-hidden my-6 shadow-xl">
      <Swiper
        modules={[Autoplay, Navigation]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        className="h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full flex items-center justify-start bg-gradient-to-r from-cyan-800 to-gray-900">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  filter: "brightness(0.4)",
                  backgroundSize: "110%",
                }}
              ></div>
              <div className="relative z-10 max-w-2xl text-white px-10 md:px-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {movie.title}
                </h1>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="flex items-center bg-cyan-600 px-2 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4 mr-1" />{" "}
                    {movie.vote_average.toFixed(1)}
                  </div>
                  <div className="flex items-center bg-white/20 px-2 py-1 rounded-full text-sm">
                    <Clock className="w-4 h-4 mr-1" />{" "}
                    {formatDuration(movie.detail?.runtime)}
                  </div>
                  <div className="flex items-center bg-white/20 px-2 py-1 rounded-full text-sm">
                    <Film className="w-4 h-4 mr-1" />{" "}
                    {movie.detail?.genres
                      ?.map((g: any) => g.name)
                      .slice(0, 2)
                      .join(", ")}
                  </div>
                </div>
                <p className="text-gray-200 mb-6 text-sm md:text-base line-clamp-3">
                  {movie.overview}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handlePesan(movie.id)}
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

      <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
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

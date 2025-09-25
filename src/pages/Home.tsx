import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import CinemaCard from "../components/CinemaCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=id-ID&page=1`
        );
        const data = await res.json();
        setMovies(data.results.slice(0, 10));
      } catch (error) {
        console.error("Gagal fetch film:", error);
      }
    };
    fetchMovies();
  }, [API_KEY]);

  const handleTrailer = async (movieId: number) => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      );
      const data = await res.json();
      const youtubeVideo = data.results.find(
        (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
      );
      if (youtubeVideo) {
        setTrailerUrl(`https://www.youtube.com/embed/${youtubeVideo.key}`);
      } else {
        alert("Trailer tidak tersedia.");
      }
    } catch (error) {
      console.error("Gagal fetch trailer:", error);
    }
  };

  const handlePesanTiket = (movieId: number) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/checkout/${movieId}`);
    }
  };

  return (
    <div>
      <Hero />

      <section className="container mx-auto px-4 py-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sedang Tayang</h2>
          <button className="flex items-center gap-2 border-2 border-cyan-600 text-cyan-600 px-4 py-1 rounded-full hover:bg-cyan-600 hover:text-white transition">
            Lihat Semua <span className="text-lg">›</span>
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          loop={true}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div className="relative group rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
                <div className="w-full aspect-[2/3]">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="absolute top-3 left-3 bg-cyan-600 text-white text-xs px-3 py-1 rounded-md">
                  Tiket Tersedia
                </span>

                <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-3 transition">
                  <h3 className="text-white font-bold text-lg text-center px-2">
                    {movie.title}
                  </h3>
                  <button
                    onClick={() => handleTrailer(movie.id)}
                    className="px-5 py-2 bg-white text-black rounded-full hover:bg-gray-300 transition"
                  >
                    Lihat Trailer
                  </button>
                  <button
                    onClick={() => handlePesanTiket(movie.id)}
                    className="px-5 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
                  >
                    Beli Tiket
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="swiper-button-prev-custom absolute top-1/2 -left-12 z-10 border-2 border-cyan-600 text-cyan-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-cyan-600 hover:text-white transition transform -translate-y-1/2 text-2xl font-bold">
          ←
        </button>
        <button className="swiper-button-next-custom absolute top-1/2 -right-12 z-10 border-2 border-cyan-600 text-cyan-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-cyan-600 hover:text-white transition transform -translate-y-1/2 text-2xl font-bold">
          →
        </button>
      </section>

      {trailerUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="w-11/12 md:w-3/4 lg:w-1/2 bg-black rounded-xl overflow-hidden">
            <iframe
              width="100%"
              height="400"
              src={trailerUrl}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              className="w-full py-2 bg-red-600 text-white font-semibold hover:bg-gray-500"
              onClick={() => setTrailerUrl(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Home;

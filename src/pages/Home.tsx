import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import CinemaCard from "../components/CinemaCard";
import MoviesSlider from "../components/MoviesSlider";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

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
        setTrailerKey(youtubeVideo.key);
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

      <MoviesSlider
        movies={movies}
        onTrailer={handleTrailer}
        onPesan={handlePesanTiket}
        onSeeAll={() => navigate("/film")}
      />

      {/* Modal Trailer */}
      {trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-black rounded-lg overflow-hidden w-[80%] max-w-3xl">
            <div className="flex justify-end p-2">
              <button
                className="text-white text-xl"
                onClick={() => setTrailerKey(null)}
              >
                ✕
              </button>
            </div>
            <iframe
              className="w-full h-[500px]"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              allowFullScreen
            ></iframe>
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

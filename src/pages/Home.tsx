import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import CinemaCard from "../components/CinemaCard";
import MoviesSlider from "../components/MoviesSlider";
import { fetchPopularMovies, fetchMovieDetail } from "../Services/api";
import TrailerModal from "../components/TrailerModal";

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

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchPopularMovies();
        console.log("Popular movies data:", data);
        setMovies(data.results.slice(0, 10));
      } catch (error) {
        console.error("Gagal fetch film:", error);
      }
    };
    loadMovies();
  }, []);

  const handleTrailer = async (movieId: number) => {
    try {
      const data = await fetchMovieDetail(movieId);
      console.log("Movie detail:", data);
      if (data.videos && data.videos.results) {
        const youtubeVideo = data.videos.results.find(
          (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        if (youtubeVideo) {
          setTrailerKey(youtubeVideo.key);
        } else {
          alert("Trailer tidak tersedia.");
        }
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


      {trailerKey && (
        <TrailerModal
          trailerKey={trailerKey}
          onClose={() => setTrailerKey(null)}
        />
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

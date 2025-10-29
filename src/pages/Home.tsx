import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import CinemaCard from "../components/CinemaCard";
import MoviesSlider from "../components/MoviesSlider";
import TrailerModal from "../components/TrailerModal";

interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  posterUrl?: string;
  backdropUrl?: string;
  description?: string;
  videos?: {
    results: { key: string; site: string; type: string }[];
  };
}

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const BASE_URL = "http://localhost:5000/api/movies";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${BASE_URL}/published`);
        if (!res.ok) throw new Error("Gagal fetch film dari backend");

        const data = await res.json();
        console.log("🎬 Data film di Home:", data);
        setMovies(Array.isArray(data) ? data : data.movies || []);
      } catch (error) {
        console.error("❌ Error fetch film:", error);
        setMovies([]);
      }
    };

    fetchMovies();
  }, []);

  const handleTrailer = async (movieId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/${movieId}/trailer`);
      if (!res.ok) throw new Error("Gagal fetch trailer dari backend");

      const data = await res.json();

      if (data.trailerUrl) {
        const match = data.trailerUrl.match(/v=([^&]+)/);
        if (match && match[1]) {
          setTrailerKey(match[1]);
        } else {
          alert("Trailer tidak tersedia.");
        }
      } else {
        alert("Trailer tidak tersedia.");
      }
    } catch (error) {
      console.error("❌ Gagal fetch trailer:", error);
    }
  };


  const handlePesanTiket = (tmdbId: number) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/checkout/${tmdbId}`);
    }
  };

  const mappedMovies = movies.map((m) => ({
    ...m,
    poster_path: m.posterUrl || "",
    tmdbId: m.tmdbId,
  }));

  return (
    <div>
      <Hero />

      <MoviesSlider
        movies={mappedMovies}
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
            name="CGV Mall Kota"
            location="Jakarta Selatan"
            studio="6 studio"
            facilities={["IMAX", "Dolby Atmos", "4DX"]}
          />
          <CinemaCard
            name="XXI Plaza Central"
            location="Jakarta Pusat"
            studio="6 studio"
            facilities={["IMAX", "Dolby Atmos", "VIP"]}
          />
          <CinemaCard
            name="Cinepolis Grand Square"
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";
import MovieCard from "../components/MovieCard";
import TrailerModal from "../components/TrailerModal";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const Film = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [category, setCategory] = useState<"now_playing" | "upcoming">(
    "now_playing"
  );
  const [search, setSearch] = useState("");
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const BASE_URL = "http://localhost:5000/api/movies";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${BASE_URL}/${category}`);
        if (!res.ok) throw new Error("Gagal fetch film dari backend");
        const data = await res.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("❌ Error fetch film:", error);
        setMovies([]);
      }
    };
    fetchMovies();
  }, [category]);

  const handleTrailer = async (movieId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/${movieId}`);
      if (!res.ok) throw new Error("Gagal fetch detail film dari backend");
      const data = await res.json();

      const youtubeVideo = data.videos?.results.find(
        (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
      );

      if (youtubeVideo) {
        setTrailerKey(youtubeVideo.key);
      } else {
        alert("Trailer tidak tersedia.");
      }
    } catch (error) {
      console.error("❌ Gagal fetch trailer:", error);
    }
  };

  const handlePesanTiket = (movieId: number) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/checkout/${movieId}`);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setCategory("now_playing")}
            className={`flex items-center gap-2 border-2 px-4 py-1 rounded-full transition ${
              category === "now_playing"
                ? "bg-cyan-600 text-white border-cyan-600"
                : "border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white"
            }`}
          >
            Sedang Tayang
          </button>
          <button
            onClick={() => setCategory("upcoming")}
            className={`flex items-center gap-2 border-2 px-4 py-1 rounded-full transition ${
              category === "upcoming"
                ? "bg-cyan-600 text-white border-cyan-600"
                : "border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white"
            }`}
          >
            Akan Tayang
          </button>
        </div>

        <div className="relative flex-1 max-w-lg md:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Mau nonton apa, nih?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-cyan-600 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            onTrailer={handleTrailer}
            onPesan={handlePesanTiket}
            isUpcoming={category === "upcoming"}
          />
        ))}
      </div>

      {trailerKey && (
        <TrailerModal
          trailerKey={trailerKey}
          onClose={() => setTrailerKey(null)}
        />
      )}
    </div>
  );
};

export default Film;

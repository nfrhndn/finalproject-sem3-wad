import React from "react";

interface MovieCardProps {
  id: number;
  tmdbId?: number;
  title: string;
  posterPath: string;
  onTrailer: (id: number) => void;
  onPesan: (id: number) => void;
  isUpcoming?: boolean;
  fullMovieData?: any;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  tmdbId,
  title,
  posterPath,
  onTrailer,
  onPesan,
  isUpcoming = false,
  fullMovieData,
}) => {
  const handlePesanClick = () => {
    if (fullMovieData) {
      localStorage.setItem("selectedMovie", JSON.stringify(fullMovieData));
    }

    onPesan(tmdbId || id);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
      <div className="w-full aspect-[2/3]">
        <img
          src={posterPath}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) =>
            (e.currentTarget.src =
              "https://via.placeholder.com/300x450?text=No+Image")
          }
        />
      </div>

      {!isUpcoming && (
        <span className="absolute top-3 left-3 bg-cyan-600 text-white text-xs px-3 py-1 rounded-md">
          Tiket Tersedia
        </span>
      )}

      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-3 transition">
        <h3 className="text-white font-bold text-lg text-center px-2">
          {title}
        </h3>
        <button
          onClick={() => onTrailer(tmdbId || id)}
          className="px-5 py-2 bg-white text-black rounded-full hover:bg-gray-300 transition"
        >
          Lihat Trailer
        </button>

        {!isUpcoming && (
          <button
            onClick={handlePesanClick}
            className="px-5 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
          >
            Beli Tiket
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

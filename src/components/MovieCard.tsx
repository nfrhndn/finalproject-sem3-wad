import React from "react";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  onTrailer: (id: number) => void;
  onPesan: (id: number) => void;
  isUpcoming?: boolean; // tambahan
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterPath,
  onTrailer,
  onPesan,
  isUpcoming = false
}) => {
  return (
    <div className="relative group rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
      <div className="w-full aspect-[2/3]">
        <img
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Badge hanya muncul kalau bukan upcoming */}
      {!isUpcoming && (
        <span className="absolute top-3 left-3 bg-cyan-600 text-white text-xs px-3 py-1 rounded-md">
          Tiket Tersedia
        </span>
      )}

      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-3 transition">
        <h3 className="text-white font-bold text-lg text-center px-2">{title}</h3>
        <button
          onClick={() => onTrailer(id)}
          className="px-5 py-2 bg-white text-black rounded-full hover:bg-gray-300 transition"
        >
          Lihat Trailer
        </button>

        {/* Tombol beli tiket hanya untuk sedang tayang */}
        {!isUpcoming && (
          <button
            onClick={() => onPesan(id)}
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

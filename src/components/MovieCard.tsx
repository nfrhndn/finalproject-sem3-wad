type MovieCardProps = {
    title: string;
    poster: string;
    trailerUrl?: string;
};

const MovieCard = ({ title, poster, trailerUrl }: MovieCardProps) => {
    return (
        <div className="relative group w-48 h-72 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
            <img src={poster} alt={title} className="w-full h-full object-cover" />

            {/* Overlay saat hover */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-3">
                {trailerUrl && (
                    <a
                        href={trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-white text-black rounded-full text-sm font-semibold shadow hover:bg-gray-200"
                    >
                        🎬 Lihat Trailer
                    </a>
                )}
                <button className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold shadow hover:bg-red-600">
                    🎟️ Beli Tiket
                </button>
            </div>

            {/* Judul */}
            <p className="mt-2 text-sm font-medium text-gray-800 text-center">{title}</p>
        </div>
    );
};

export default MovieCard;

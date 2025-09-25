type MovieCardProps = {
  title: string;
  genre: string;
  description: string;
  duration: string;
  rating: number;
  image?: string;
  onPesan?: () => void;
  showBooking?: boolean;
};

const MovieCard = ({
  title,
  genre,
  description,
  duration,
  rating,
  image,
  onPesan,
  showBooking = true,
}: MovieCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {image && (
        <img src={image} alt={title} className="w-full h-64 object-cover" />
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-600">{genre}</p>
        <p className="text-sm mt-2">{description}</p>
        <p className="text-sm text-gray-500 mt-1">{duration}</p>
        <p className="text-sm font-semibold mt-1">⭐ {rating}</p>

        {showBooking && (
          <button
            onClick={onPesan}
            className="mt-3 w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
          >
            Pesan
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

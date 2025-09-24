import { Clock, Star } from "lucide-react";

type Props = {
    title: string;
    genre: string;
    description: string;
    duration: string;
    rating: number;
};

const MovieCard = ({ title, genre, description, duration, rating }: Props) => {
    return (
        <div className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                🎬
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <span className="flex items-center gap-1 text-sm text-cyan-600">
                        <Star className="w-4 h-4 fill-gradient-to-r from-cyan-600 to-blue-500" /> {rating}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{genre}</p>
                <p className="text-sm text-gray-600 mb-3 flex-grow">{description}</p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {duration}
                    </span>
                    <button className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-500 text-white rounded-lg hover:bg-cyan-700 text-sm">
                        Pesan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;

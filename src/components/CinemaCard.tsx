import { MapPin } from "lucide-react";

type Props = {
  name: string;
  location: string;
  studio: string;
  facilities: string[];
};

const CinemaCard = ({ name, location, studio, facilities }: Props) => {
  return (
    <div className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition flex flex-col">
      <h3 className="font-bold text-lg mb-1">{name}</h3>
      <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
        <MapPin className="w-4 h-4" /> {location}
      </p>
      <p className="text-sm text-gray-700 font-medium mb-3">Studio: {studio}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {facilities.map((f) => (
          <span
            key={f}
            className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-600 to-blue-500 text-white rounded-lg"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CinemaCard;

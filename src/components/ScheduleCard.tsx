import { Calendar } from "lucide-react";

type ScheduleCardProps = {
    title: string;
    times: string[];
};

const ScheduleCard = ({ title, times }: ScheduleCardProps) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                <Calendar size={16} /> Jadwal Hari Ini
            </div>
            <div className="grid grid-cols-2 gap-2">
                {times.map((t, i) => (
                    <span
                        key={i}
                        className="bg-gray-100 text-gray-700 py-1 px-2 rounded text-sm text-center hover:bg-gradient-to-r from-cyan-600 to-blue-500 hover:text-white transition"
                    >
                        {t}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ScheduleCard;

interface MovieFilterProps {
    filter: string;
    setFilter: (value: string) => void;
}

export default function MovieFilter({ filter, setFilter }: MovieFilterProps) {
    return (
        <div className="flex gap-2 mb-4">
            {["Semua", "Sedang Tayang", "Akan Tayang"].map((status) => (
                <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg border transition ${filter === status
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    {status}
                </button>
            ))}
        </div>
    );
}

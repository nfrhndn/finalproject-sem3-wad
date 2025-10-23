import { Edit, Trash2 } from "lucide-react";
import type { AdminMovie } from "../../types/AdminMovie";

interface MovieTableProps {
    movies: AdminMovie[];
    handleEdit: (movie: AdminMovie) => void;
    handleDelete: (movie: AdminMovie) => void;
}

export default function MovieTable({
    movies,
    handleEdit,
    handleDelete,
}: MovieTableProps) {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                    <tr>
                        <th className="p-3">Poster</th>
                        <th className="p-3">Judul</th>
                        <th className="p-3">Genre</th>
                        <th className="p-3">Rilis</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Sumber</th>
                        <th className="p-3 text-center">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {movies.map((movie, index) => (
                        <tr
                            key={`${movie.source || "unknown"}-${movie.id}-${index}`}
                            className="border-b hover:bg-gray-50 transition"
                        >
                            <td className="p-3">
                                {movie.poster ? (
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-16 h-20 object-cover rounded shadow-sm"
                                    />
                                ) : (
                                    <div className="w-16 h-20 bg-gray-200 rounded" />
                                )}
                            </td>
                            <td className="p-3 font-medium text-gray-800">{movie.title}</td>
                            <td className="p-3">{movie.genre || "-"}</td>
                            <td className="p-3">{movie.releaseDate || "-"}</td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded text-white ${movie.status === "Sedang Tayang"
                                        ? "bg-green-600"
                                        : "bg-yellow-600"
                                        }`}
                                >
                                    {movie.status}
                                </span>
                            </td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded text-xs ${movie.source === "manual"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {movie.source === "manual" ? "Manual" : "TMDB"}
                                </span>
                            </td>
                            <td className="p-3 text-center">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(movie)}
                                        className="p-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                        title="Edit Film"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(movie)}
                                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
                                        title="Hapus Film"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {movies.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-4 text-center text-gray-500">
                                Belum ada data film
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

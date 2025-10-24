import { SquarePenIcon, Trash2 } from "lucide-react";

export default function MovieTable({ movies, selected, toggleSelect, openEditModal }: any) {
    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                    <tr>
                        <th className="p-3"><input type="checkbox" /></th>
                        <th className="p-3">Poster</th>
                        <th className="p-3">Judul</th>
                        <th className="p-3">Genre</th>
                        <th className="p-3">Deskripsi</th>
                        <th className="p-3">Tanggal Rilis</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie: any) => (
                        <tr
                            key={movie.id}
                            className={`border-t border-gray-200 hover:bg-cyan-50 transition ${selected.includes(movie.id) ? "bg-cyan-100" : ""}`}
                        >
                            <td className="p-3">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(movie.id)}
                                    onChange={() => toggleSelect(movie.id)}
                                />
                            </td>
                            <td className="p-3 text-gray-500">Poster</td>
                            <td className="p-3 font-medium text-gray-800">{movie.title}</td>
                            <td className="p-3">
                                <div className="flex gap-1 flex-wrap">
                                    {movie.genres.map((genre: string) => (
                                        <span key={genre} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">{genre}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="p-3 text-gray-600 max-w-xs truncate">{movie.description}</td>
                            <td className="p-3">{movie.releaseDate}</td>
                            <td className="p-3">
                                {movie.status === "Sedang Tayang" && (
                                    <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-md">Sedang Tayang</span>
                                )}
                                {movie.status === "Akan Tayang" && (
                                    <span className="bg-cyan-200 text-cyan-800 text-xs px-2 py-1 rounded-md">Akan Tayang</span>
                                )}
                                {movie.status === "Tidak Tayang" && (
                                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md">Tidak Tayang</span>
                                )}
                            </td>
                            <td className="p-3 text-right flex justify-end gap-3">
                                {movie.status !== "Tidak Tayang" && (
                                    <button
                                        onClick={() => openEditModal(movie)}
                                        className="text-gray-500 hover:text-cyan-600 transition"
                                    >
                                        <SquarePenIcon size={16} />
                                    </button>
                                )}
                                <button className="text-red-500 hover:text-red-600 transition">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

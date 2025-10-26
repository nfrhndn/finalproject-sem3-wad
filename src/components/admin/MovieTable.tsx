import { Trash2 } from "lucide-react";

interface MovieTableProps {
  movies: any[];
  selected: number[];
  toggleSelect: (id: number) => void;
  handleDelete: (id: number) => void;
  handleUnpublish?: (id: number) => void;
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function MovieTable({
  movies,
  selected,
  toggleSelect,
  handleDelete,
  handleUnpublish,
  setSelected,
}: MovieTableProps) {
  const toggleSelectAll = () => {
    if (selected.length === movies.length) {
      setSelected([]);
    } else {
      setSelected(movies.map((m) => m.id));
    }
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-base text-left border-collapse">
        <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 text-[15px]">
          <tr>
            <th className="p-4 text-center">
              <input
                type="checkbox"
                checked={movies.length > 0 && selected.length === movies.length}
                onChange={toggleSelectAll}
                className="w-5 h-5 cursor-pointer accent-cyan-600"
              />
            </th>
            <th className="p-4">Poster</th>
            <th className="p-4">Judul</th>
            <th className="px-2 py-4">Genre</th>
            <th className="p-4">Deskripsi</th>
            <th className="p-4">Tanggal Rilis</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody className="text-[15px]">
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => {
              const releaseDate = movie.releaseDate
                ? new Date(movie.releaseDate)
                : null;

              let statusLabel = "Tidak Tayang";
              if (movie.status === "PUBLISHED") statusLabel = "Sedang Tayang";
              else if (movie.status === "UPCOMING") statusLabel = "Akan Tayang";

              return (
                <tr
                  key={movie.id}
                  className={`border-t border-gray-200 hover:bg-cyan-50 transition ${selected.includes(movie.id) ? "bg-cyan-100" : ""
                    }`}
                >
                  <td className="p-4 align-middle text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(movie.id)}
                      onChange={() => toggleSelect(movie.id)}
                      className="w-5 h-5 cursor-pointer accent-cyan-600"
                    />
                  </td>

                  <td className="p-4 text-gray-500 align-middle">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded-md shadow-sm"
                      />
                    ) : (
                        <span className="text-gray-400 italic text-sm">
                        Tidak ada poster
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-semibold text-gray-800 align-middle">
                    {movie.title}
                  </td>

                  <td className="px-2 py-4 align-middle">
                    <div className="flex gap-1 flex-wrap">
                      {Array.isArray(movie.genres) && movie.genres.length > 0 ? (
                        movie.genres.map((genre: string) => (
                          <span
                            key={genre}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                          >
                            {genre}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          Tidak ada genre
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-gray-600 max-w-xs truncate align-middle">
                    {movie.description || "-"}
                  </td>

                  <td className="p-4 align-middle">
                    {releaseDate ? releaseDate.toLocaleDateString("id-ID") : "-"}
                  </td>

                  <td className="p-4 align-middle">
                    {statusLabel === "Sedang Tayang" && (
                      <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-md">
                        Sedang Tayang
                      </span>
                    )}
                    {statusLabel === "Akan Tayang" && (
                      <span className="bg-cyan-200 text-cyan-800 text-xs px-2 py-1 rounded-md">
                        Akan Tayang
                      </span>
                    )}
                    {statusLabel === "Tidak Tayang" && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md">
                        Tidak Tayang
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-3 h-full">
                      {handleUnpublish && statusLabel !== "Tidak Tayang" && (
                        <button
                          onClick={() => handleUnpublish(movie.id)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs transition"
                        >
                          Unpublish Film
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="flex items-center justify-center h-9 w-9 rounded-md bg-white hover:bg-red-50 transition"
                        title="Hapus Film"
                        aria-label={`Hapus ${movie.title}`}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-500">
                Belum ada film yang tersedia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

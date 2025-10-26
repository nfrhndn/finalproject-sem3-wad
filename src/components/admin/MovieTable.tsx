import { Trash2 } from "lucide-react";

interface MovieTableProps {
  movies: any[];
  selected: number[];
  toggleSelect: (id: number) => void;
  openEditModal?: (movie: any) => void;
  handleDelete: (id: number) => void;
  handleUnpublish?: (id: number) => void;
  setShowPublishModal?: (show: boolean) => void;
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function MovieTable({
  movies,
  selected,
  toggleSelect,
  handleDelete,
  handleUnpublish,
}: MovieTableProps) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
          <tr>
            <th className="p-3">
              <input type="checkbox" />
            </th>
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
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => {
              const releaseDate = movie.releaseDate
                ? new Date(movie.releaseDate)
                : null;

              let statusLabel = "Tidak Tayang";
              if (movie.status === "PUBLISHED") statusLabel = "Sedang Tayang";
              else if (movie.status === "UPCOMING") statusLabel = "Akan Tayang";
              else if (movie.status === "ARCHIVED") statusLabel = "Tidak Tayang";

              return (
                <tr
                  key={movie.id}
                  className={`border-t border-gray-200 hover:bg-cyan-50 transition ${selected.includes(movie.id) ? "bg-cyan-100" : ""
                    }`}
                >
                  <td className="p-3 align-middle">
                    <input
                      type="checkbox"
                      checked={selected.includes(movie.id)}
                      onChange={() => toggleSelect(movie.id)}
                    />
                  </td>

                  <td className="p-3 text-gray-500 align-middle">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        Tidak ada poster
                      </span>
                    )}
                  </td>

                  <td className="p-3 font-medium text-gray-800 align-middle">
                    {movie.title}
                  </td>

                  <td className="p-3 align-middle">
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

                  <td className="p-3 text-gray-600 max-w-xs truncate align-middle">
                    {movie.description || "-"}
                  </td>

                  <td className="p-3 align-middle">
                    {releaseDate ? releaseDate.toLocaleDateString("id-ID") : "-"}
                  </td>

                  <td className="p-3 align-middle">
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

                  <td className="p-3 text-right align-middle">
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
                        className="flex items-center justify-center h-8 w-8 rounded-md bg-white hover:bg-red-50 transition"
                        title="Hapus Film"
                        aria-label={`Hapus ${movie.title}`}
                      >
                        <Trash2 size={16} className="text-red-500" />
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

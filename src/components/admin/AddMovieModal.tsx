import { useRef } from "react";
import type { AdminMovie } from "../../types/AdminMovie";

interface AddMovieModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (formData: FormData) => void;
    movie: AdminMovie;
    setMovie: React.Dispatch<React.SetStateAction<AdminMovie>>;
}

export default function AddMovieModal({
    show,
    onClose,
    onSave,
    movie,
    setMovie,
}: AddMovieModalProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    if (!show) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        // ✅ Sesuaikan dengan schema Prisma
        formData.append("title", movie.title);
        formData.append("genre", movie.genre || "");
        formData.append("description", movie.synopsis || "");
        formData.append("status", movie.status || "Sedang Tayang");
        formData.append("source", movie.source || "manual"); // ✅ Tambah kolom sumber

        // ✅ Format tanggal agar sesuai ISO (PostgreSQL friendly)
        if (movie.releaseDate) {
            formData.append("releaseDate", new Date(movie.releaseDate).toISOString());
        }

        // ✅ Upload file poster (gambar)
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            formData.append("poster", file); // kirim file
        } else if (movie.poster) {
            formData.append("posterUrl", movie.poster); // kirim URL
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">
                    {movie.id ? "Edit Film" : "Tambah Film Baru"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Judul */}
                    <input
                        type="text"
                        placeholder="Judul"
                        value={movie.title}
                        onChange={(e) => setMovie({ ...movie, title: e.target.value })}
                        className="w-full border rounded p-2"
                        required
                    />

                    {/* Genre */}
                    <input
                        type="text"
                        placeholder="Genre"
                        value={movie.genre || ""}
                        onChange={(e) => setMovie({ ...movie, genre: e.target.value })}
                        className="w-full border rounded p-2"
                    />

                    {/* Tanggal Rilis */}
                    <input
                        type="date"
                        value={movie.releaseDate || ""}
                        onChange={(e) => setMovie({ ...movie, releaseDate: e.target.value })}
                        className="w-full border rounded p-2"
                    />

                    {/* Sinopsis */}
                    <textarea
                        placeholder="Sinopsis"
                        value={movie.synopsis || ""}
                        onChange={(e) => setMovie({ ...movie, synopsis: e.target.value })}
                        className="w-full border rounded p-2 h-20"
                    />

                    {/* Upload file poster */}
                    <div>
                        <label className="block text-sm mb-1">Upload Poster (gambar)</label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    {/* Atau pakai URL */}
                    <div>
                        <label className="block text-sm mb-1">
                            Atau URL Poster (opsional)
                        </label>
                        <input
                            type="text"
                            placeholder="https://example.com/poster.jpg"
                            value={movie.poster || ""}
                            onChange={(e) => setMovie({ ...movie, poster: e.target.value })}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    {/* Status */}
                    <select
                        value={movie.status || "Sedang Tayang"}
                        onChange={(e) => setMovie({ ...movie, status: e.target.value })}
                        className="w-full border rounded p-2"
                    >
                        <option value="Sedang Tayang">Sedang Tayang</option>
                        <option value="Akan Tayang">Akan Tayang</option>
                    </select>

                    {/* ✅ Dropdown sumber film */}
                    <select
                        value={movie.source || "manual"}
                        onChange={(e) =>
                            setMovie({ ...movie, source: e.target.value as "manual" | "tmdb" })
                        }
                        className="w-full border rounded p-2"
                    >
                        <option value="manual">Manual</option>
                        <option value="tmdb">TMDB (API)</option>
                    </select>


                    {/* Tombol */}
                    <div className="flex justify-end mt-5 space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

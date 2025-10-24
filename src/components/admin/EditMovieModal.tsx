export default function EditMovieModal({ movie, setMovie, onClose, onSave }: any) {
    if (!movie) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-4">Edit Film</h2>

                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                    type="text"
                    value={movie.title}
                    onChange={(e) => setMovie({ ...movie, title: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-cyan-400"
                />

                <label className="block text-sm font-medium mb-1">Genre (pisahkan dengan koma)</label>
                <input
                    type="text"
                    value={movie.genres.join(", ")}
                    onChange={(e) =>
                        setMovie({
                            ...movie,
                            genres: e.target.value.split(",").map((g) => g.trim()),
                        })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-cyan-400"
                />

                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                    value={movie.description}
                    onChange={(e) => setMovie({ ...movie, description: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-cyan-400"
                />

                <label className="block text-sm font-medium mb-1">Tanggal Rilis</label>
                <input
                    type="text"
                    value={movie.releaseDate}
                    onChange={(e) => setMovie({ ...movie, releaseDate: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-5 focus:ring-2 focus:ring-cyan-400"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100">
                        Batal
                    </button>
                    <button onClick={onSave} className="px-4 py-2 text-sm rounded-lg bg-cyan-600 text-white hover:bg-cyan-700">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PublishModal({ movies, selected, publishStatus, setPublishStatus, onClose, onPublish }: any) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-1">Publish Film</h2>
                <p className="text-gray-500 mb-4 text-sm">
                    Pilih status publikasi untuk {selected.length} film yang dipilih
                </p>

                <label className="block text-sm font-medium mb-2">Status Publikasi</label>
                <select
                    value={publishStatus}
                    onChange={(e) => setPublishStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                >
                    <option value="Sedang Tayang">Sedang Tayang</option>
                    <option value="Akan Tayang">Akan Tayang</option>
                    <option value="Tidak Tayang">Tidak Tayang</option>
                </select>

                <div className="bg-gray-50 rounded-lg p-3 mb-5 text-sm">
                    <p className="font-medium mb-2">Film yang akan dipublish:</p>
                    {movies.filter((m: any) => selected.includes(m.id)).map((m: any) => (
                        <div key={m.id} className="border border-gray-200 rounded-md p-2 flex items-center justify-between mb-2">
                            <div>
                                <p className="font-semibold">{m.title}</p>
                                <div className="flex gap-1 mt-1">
                                    {m.genres.map((g: string) => (
                                        <span key={g} className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">{g}</span>
                                    ))}
                                </div>
                            </div>
                            <span className="text-gray-400 text-xs">Poster</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100">
                        Batal
                    </button>
                    <button onClick={onPublish} className="px-4 py-2 text-sm rounded-lg bg-cyan-600 text-white hover:bg-cyan-700">
                        Publish Film
                    </button>
                </div>
            </div>
        </div>
    );
}

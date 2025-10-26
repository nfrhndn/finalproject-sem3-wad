export default function UnpublishModal({
    movies,
    selected,
    onClose,
    onUnpublish,
}: any) {
    const selectedMovies = movies.filter((m: any) => selected.includes(m.id));

    return (
        <div className="fixed inset-0 bg-gray-900/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-1">
                    Unpublish Film
                </h2>
                <p className="text-gray-500 mb-4 text-sm">
                    Apakah Anda yakin ingin <b>unpublish</b> film berikut?
                </p>

                <div className="bg-gray-50 rounded-lg p-3 mb-5 text-sm max-h-60 overflow-y-auto">
                    {selectedMovies.length > 0 ? (
                        selectedMovies.map((m: any) => (
                            <div
                                key={m.id}
                                className="border border-gray-200 rounded-md p-2 flex items-center gap-3 mb-2"
                            >
                                {m.posterUrl ? (
                                    <img
                                        src={m.posterUrl}
                                        alt={m.title}
                                        className="w-10 h-14 object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="w-10 h-14 bg-gray-300 rounded-md flex items-center justify-center text-gray-500 text-xs">
                                        N/A
                                    </div>
                                )}

                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{m.title}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {m.genres &&
                                            m.genres.map((g: any, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded"
                                                >
                                                    {typeof g === "string" ? g : g.genre?.name}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 italic">Tidak ada film dipilih</p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onUnpublish}
                        disabled={selectedMovies.length === 0}
                        className={`px-4 py-2 text-sm rounded-lg text-white transition ${selectedMovies.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        Unpublish Film
                    </button>
                </div>
            </div>
        </div>
    );
}

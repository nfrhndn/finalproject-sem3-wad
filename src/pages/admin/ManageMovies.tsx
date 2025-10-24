import { useState } from "react";
import MovieTable from "../../components/admin/MovieTable";
import PublishModal from "../../components/admin/PublishModal";
import EditMovieModal from "../../components/admin/EditMovieModal";

export default function ManageMovies() {
    const [movies, setMovies] = useState([
        { id: 1, title: "Sample Movie 1", genres: ["Action", "Adventure"], description: "This is a sample movie description...", releaseDate: "15-01-2025", status: "Sedang Tayang" },
        { id: 2, title: "Sample Movie 2", genres: ["Drama", "Thriller"], description: "Another sample movie...", releaseDate: "20-02-2025", status: "Tidak Tayang" },
        { id: 3, title: "Sample Movie 3", genres: ["Sci-Fi", "Action"], description: "Upcoming sci-fi blockbuster...", releaseDate: "15-06-2025", status: "Akan Tayang" },
    ]);

    const [selected, setSelected] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua");
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [publishStatus, setPublishStatus] = useState("Sedang Tayang");
    const [editingMovie, setEditingMovie] = useState<any>(null);

    const filteredMovies = movies.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "Semua" || m.status === statusFilter)
    );

    const toggleSelect = (id: number) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handlePublish = () => {
        setMovies((prev) =>
            prev.map((m) => (selected.includes(m.id) ? { ...m, status: publishStatus } : m))
        );
        setSelected([]);
        setShowPublishModal(false);
    };

    const openEditModal = (movie: any) => {
        setEditingMovie(movie);
        setShowEditModal(true);
    };

    const handleEditSave = () => {
        if (editingMovie) {
            setMovies((prev) => prev.map((m) => (m.id === editingMovie.id ? editingMovie : m)));
        }
        setShowEditModal(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold mb-2">Kelola Film</h1>
            <p className="text-gray-500 mb-6">Impor film dari TMDB dan kelola publikasi ke web utama</p>

            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Cari judul film..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-64 text-sm focus:ring-2 focus:ring-cyan-400"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400"
                    >
                        <option value="Semua">Semua Status</option>
                        <option value="Sedang Tayang">Sedang Tayang</option>
                        <option value="Akan Tayang">Akan Tayang</option>
                        <option value="Tidak Tayang">Tidak Tayang</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100">
                        Import dari TMDB
                    </button>
                    <button
                        onClick={() => setShowPublishModal(true)}
                        disabled={selected.length === 0}
                        className={`px-4 py-2 rounded-lg text-sm text-white transition ${selected.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"
                            }`}
                    >
                        Publish Film ({selected.length})
                    </button>
                </div>
            </div>

            <MovieTable
                movies={filteredMovies}
                selected={selected}
                toggleSelect={toggleSelect}
                openEditModal={openEditModal}
            />

            <p className="text-sm text-gray-500 mt-3">Total: {filteredMovies.length} film</p>

            {showPublishModal && (
                <PublishModal
                    movies={movies}
                    selected={selected}
                    publishStatus={publishStatus}
                    setPublishStatus={setPublishStatus}
                    onClose={() => setShowPublishModal(false)}
                    onPublish={handlePublish}
                />
            )}

            {showEditModal && (
                <EditMovieModal
                    movie={editingMovie}
                    setMovie={setEditingMovie}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleEditSave}
                />
            )}
        </div>
    );
}

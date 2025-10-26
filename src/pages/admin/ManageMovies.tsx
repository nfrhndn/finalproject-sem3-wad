import { Download, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import MovieTable from "../../components/admin/MovieTable";
import PublishModal from "../../components/admin/PublishModal";
import UnpublishModal from "../../components/admin/UnpublishModal";

export default function ManageMovies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [publishStatus, setPublishStatus] = useState("Sedang Tayang");
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const query =
        statusFilter && statusFilter !== "ALL" ? `?status=${statusFilter}` : "";
      const res = await fetch(`http://localhost:5000/api/movies${query}`);

      if (!res.ok) throw new Error("Gagal mengambil data film");
      const data = await res.json();

      const formattedMovies = Array.isArray(data)
        ? data.map((m: any) => ({
          id: m.id,
          title: m.title || "Tanpa Judul",
          description: m.description || "-",
          releaseDate: m.releaseDate || m.release_date || "Tidak diketahui",
          posterUrl: m.posterUrl || m.poster_path || "",
          backdropUrl: m.backdropUrl || m.backdrop_path || "",
          duration: m.duration || m.runtime || 0,
          status: m.status || "DRAFT",
          isPublished: m.isPublished ?? false,
          genres: Array.isArray(m.genres)
            ? m.genres.map((g: any) =>
              typeof g === "string" ? g : g.genre?.name || g.name || "-"
            )
            : [],
        }))
        : [];

      setMovies(formattedMovies);
    } catch (err) {
      console.error("❌ Gagal fetch film:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [statusFilter]);

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "Semua" || m.status === statusFilter)
  );

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePublish = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Sesi kamu sudah berakhir. Silakan login ulang.");
    if (!publishStatus) return alert("Pilih status publikasi terlebih dahulu.");

    const statusMap: Record<string, string> = {
      "Sedang Tayang": "PUBLISHED",
      "Akan Tayang": "UPCOMING",
      "Tidak Tayang": "DRAFT",
    };

    const mappedStatus = statusMap[publishStatus] || "PUBLISHED";

    try {
      setLoading(true);
      for (const id of selected) {
        await fetch(`http://localhost:5000/api/movies/${id}/publish`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: mappedStatus }),
        });
      }
      await fetchMovies();
      setSelected([]);
      setShowPublishModal(false);
      alert(`✅ ${selected.length} film berhasil dipublish sebagai "${publishStatus}"`);
    } catch (err) {
      console.error("🔥 Error handlePublish:", err);
      alert("❌ Terjadi kesalahan saat mempublish film");
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Sesi kamu sudah berakhir. Silakan login ulang.");

    const selectedMovies = movies.filter((m) => selected.includes(m.id));

    const invalidMovies = selectedMovies.filter(
      (m) => m.status === "DRAFT" || m.status === "Tidak Tayang"
    );

    if (invalidMovies.length > 0) {
      const titles = invalidMovies.map((m) => `- ${m.title}`).join("\n");
      alert(
        `⚠️ Film berikut tidak dapat di-unpublish karena statusnya "Tidak Tayang":\n${titles}`
      );
      return;
    }

    try {
      setLoading(true);
      for (const id of selected) {
        await fetch(`http://localhost:5000/api/movies/${id}/unpublish`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await fetchMovies();
      setSelected([]);
      setShowUnpublishModal(false);
      alert(`🚫 ${selected.length} film berhasil di-unpublish.`);
    } catch (err) {
      console.error("❌ Gagal unpublish:", err);
      alert("❌ Terjadi kesalahan saat unpublish film");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Sesi kamu sudah berakhir. Silakan login ulang.");
    if (!confirm("⚠️ Film akan dihapus permanen dari database. Lanjutkan?")) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menghapus film");
      alert("🗑️ Film berhasil dihapus");
      await fetchMovies();
    } catch (err) {
      console.error("❌ Gagal hapus film:", err);
      alert("❌ Terjadi kesalahan saat menghapus film");
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromTMDB = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return alert("Sesi kamu sudah berakhir. Silakan login ulang.");

      const res = await fetch("http://localhost:5000/api/tmdb/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal import TMDB");

      alert(`✅ ${data.message || "Import dari TMDB berhasil!"}`);
      await fetchMovies();
    } catch (err) {
      console.error("🔥 Error import TMDB:", err);
      alert("Terjadi kesalahan saat mengimpor film dari TMDB.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-2">Kelola Film</h1>
      <p className="text-gray-500 mb-6">
        Impor film dari TMDB dan kelola publikasi ke web utama
      </p>

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
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Sedang Tayang</option>
            <option value="UPCOMING">Akan Tayang</option>
            <option value="DRAFT">Tidak Tayang</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleImportFromTMDB}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition ${loading
              ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
              : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
              }`}
          >
            <Download size={16} className="text-gray-500" />
            {loading ? "Mengimpor..." : "Import dari TMDB"}
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            disabled={selected.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition ${selected.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-700"
              }`}
          >
            <Eye size={16} />
            Publish Film ({selected.length})
          </button>

          <button
            onClick={() => setShowUnpublishModal(true)}
            disabled={
              selected.length === 0 ||
              movies
                .filter((m) => selected.includes(m.id))
                .every((m) => m.status === "Tidak Tayang" || m.status === "DRAFT")
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition ${selected.length === 0 ||
              movies
                .filter((m) => selected.includes(m.id))
                .every((m) => m.status === "Tidak Tayang" || m.status === "DRAFT")
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
              }`}
          >
            <EyeOff size={16} />
            Unpublish Film
          </button>

        </div>
      </div>

      <MovieTable
        movies={filteredMovies}
        selected={selected}
        toggleSelect={toggleSelect}
        handleDelete={handleDelete}
        setSelected={setSelected}
      />

      <p className="text-sm text-gray-500 mt-3">
        Total: {filteredMovies.length} film
      </p>

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

      {showUnpublishModal && (
        <UnpublishModal
          movies={movies}
          selected={selected}
          onClose={() => setShowUnpublishModal(false)}
          onUnpublish={handleUnpublish}
        />
      )}
    </div>
  );
}

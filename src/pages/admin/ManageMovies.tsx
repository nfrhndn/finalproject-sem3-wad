import { useEffect, useState } from "react";
import MovieTable from "../../components/admin/MovieTable";
import PublishModal from "../../components/admin/PublishModal";

export default function ManageMovies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [showPublishModal, setShowPublishModal] = useState(false);
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
      Draft: "DRAFT",
      Arsip: "ARCHIVED",
    };

    const mappedStatus = statusMap[publishStatus] || "PUBLISHED";

    try {
      setLoading(true);

      for (const id of selected) {
        const res = await fetch(
          `http://localhost:5000/api/movies/${id}/publish`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: mappedStatus,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) {
          console.error("❌ Gagal publish film:", data.error || data.message);
        } else {
          console.log(`✅ Film ID ${id} dipublish sebagai ${mappedStatus}`);
        }
      }

      await fetchMovies();
      setSelected([]);
      setShowPublishModal(false);

      alert(
        `✅ ${selected.length} film berhasil dipublish sebagai "${publishStatus}"`
      );
    } catch (err) {
      console.error("🔥 Error handlePublish:", err);
      alert("❌ Terjadi kesalahan saat mempublish film");
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Sesi kamu sudah berakhir. Silakan login ulang.");
    if (!confirm("Yakin ingin menarik film ini dari web utama?")) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/movies/${id}/unpublish`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal unpublish film");

      alert("✅ Film berhasil di-unpublish");
      await fetchMovies();
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
    if (!confirm("⚠️ Film akan dihapus permanen dari database. Lanjutkan?"))
      return;

    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus film");

      alert("🗑️ Film berhasil dihapus sepenuhnya");
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
      if (!token)
        return alert("Sesi kamu sudah berakhir. Silakan login ulang.");

      const res = await fetch("http://localhost:5000/api/tmdb/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Gagal import TMDB:", data.message);
        alert(data.message || "Gagal mengimpor film dari TMDB.");
        return;
      }

      alert(`✅ ${data.message || "Import dari TMDB berhasil!"}`);

      if (data.movies && Array.isArray(data.movies)) {
        const formattedMovies = data.movies.map((m: any) => ({
          id: m.id,
          title: m.title || "Tanpa Judul",
          description: m.description || m.overview || "-",
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
        }));

        setMovies(formattedMovies);
      } else {
        await fetchMovies();
      }
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
            className={`px-4 py-2 border rounded-lg text-sm transition ${
              loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            {loading ? "Mengimpor..." : "Import dari TMDB"}
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            disabled={selected.length === 0}
            className={`px-4 py-2 rounded-lg text-sm text-white transition ${
              selected.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-700"
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
        handleDelete={handleDelete}
        handleUnpublish={handleUnpublish}
        setShowPublishModal={setShowPublishModal}
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
    </div>
  );
}

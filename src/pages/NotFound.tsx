import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 text-center px-4">
      <h1 className="text-6xl font-bold text-cyan-600">404</h1>
      <p className="mt-4 text-lg">Halaman yang kamu cari tidak ditemukan.</p>

      <Link
        to={user ? "/" : "/login"}
        className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;

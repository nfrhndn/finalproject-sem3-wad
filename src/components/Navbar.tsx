import { Film } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                <div className="flex items-center space-x-2">
                    <Film className="w-6 h-6 text-sky-500" />
                    <span className="text-xl font-bold text-sky-600">CinemaPlus</span>
                </div>
                <nav className="flex space-x-6 text-gray-700 font-medium">
                    <Link to="/" className="text-sky-600">
                        Beranda
                    </Link>
                    <Link to="/kursi">Pilih Kursi</Link>
                    <Link to="/keranjang">Keranjang</Link>
                    <Link to="/kontak">Kontak</Link>
                    <Link to="/profil">Profil</Link>
                </nav>
                <div className="flex space-x-3">
                    <button className="px-4 py-1 rounded-lg border border-sky-500 text-sky-500 hover:bg-sky-50">
                        Masuk
                    </button>
                    <button className="px-4 py-1 rounded-lg bg-sky-500 text-white hover:bg-sky-600">
                        Daftar
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

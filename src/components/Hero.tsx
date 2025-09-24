import { Play } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Selamat Datang di <span className="text-cyan-200">CinemaPlus</span></h1>
                <p className="text-lg mb-6">Nikmati pengalaman menonton terbaik dengan teknologi cinema terdepan dan layanan premium</p>
                <Link
                    to="/pesan"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-600 font-semibold rounded-lg shadow hover:bg-gray-100"
                >
                    <Play className="w-5 h-5" /> Pesan Tiket Sekarang
                </Link>
            </div>
        </section>
    );
};

export default Hero;

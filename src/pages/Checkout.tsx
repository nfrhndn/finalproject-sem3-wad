import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Clock3, Calendar, Star } from "lucide-react";
import { fetchMovieDetail, bookingApi } from "../Services/api";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  original_language: string;
  vote_average: number;
}

interface CartItem {
  id: number;
  movieId: number;
  title: string;
  poster: string;
  cinema: string;
  date?: string;
  time: string;
  seats: string[];
  price?: number;
  total?: number;
}

const cinemaPrices: Record<string, number> = {
  "CGV Mall Kota": 50000,
  "XXI Plaza Central": 60000,
  "Cinepolis Grand Square": 55000,
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Checkout = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeats] = useState<string[]>(["A2", "A3", "C7", "D8", "F5"]);

  useEffect(() => {
    if (!movieId) return;
    const fetchMovie = async () => {
      try {
        const data = await fetchMovieDetail(Number(movieId));
        setMovie(data);
      } catch (err) {
        console.error("Gagal fetch movie:", err);
      }
    };
    fetchMovie();
  }, [movieId]);

  if (!movie) return <p className="text-center py-10">Loading...</p>;

  const showTimes = ["10:00", "13:30", "16:00", "19:00", "21:30"];
  const cinemas = Object.keys(cinemaPrices);

  const rows = ["A", "B", "C", "D", "E", "F"];
  const cols = Array.from({ length: 12 }, (_, i) => i + 1);

  const toggleSeat = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const ticketPrice = selectedCinema ? cinemaPrices[selectedCinema] : 0;
  const totalPrice = selectedSeats.length * ticketPrice;

  const handleCheckout = async () => {
    if (
      !movie ||
      !selectedCinema ||
      !selectedDate ||
      !selectedTime ||
      selectedSeats.length === 0
    ) {
      alert(
        "Lengkapi pilihan bioskop, tanggal, jam, dan kursi terlebih dahulu."
      );
      return;
    }

    const order: CartItem = {
      id: Date.now(),
      movieId: movie.id,
      title: movie.title,
      poster: `${IMAGE_BASE_URL}${movie.poster_path}`,
      cinema: selectedCinema,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats,
      price: ticketPrice,
      total: totalPrice,
    };

    try {
      await bookingApi(order);
      navigate("/cart");
    } catch (err) {
      console.error("❌ Checkout gagal:", err);
      alert("Gagal melakukan checkout. Silakan coba lagi.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">
      <div className="md:col-span-1 flex flex-col gap-4">
        <img
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="rounded-xl shadow-lg w-full"
        />
        <div className="flex items-center gap-2 text-blue-600 font-semibold">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-bold mb-2">Sinopsis</h3>
          <p className="text-sm text-gray-700">{movie.overview}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-sm">
          <h3 className="font-bold mb-2">Informasi Film</h3>
          <p>
            <span className="font-semibold">Bahasa:</span>{" "}
            {movie.original_language}
          </p>
          <p>
            <span className="font-semibold">Durasi:</span> {movie.runtime} menit
          </p>
          <p>
            <span className="font-semibold">Genre:</span>{" "}
            {movie.genres.map((g) => g.name).join(", ")}
          </p>
          <p>
            <span className="font-semibold">Tanggal Rilis:</span>{" "}
            {movie.release_date}
          </p>
        </div>
      </div>

      <div className="md:col-span-2 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">{movie.title}</h1>

        <div>
          <label className="font-semibold mb-2 block flex items-center gap-2">
            <MapPin size={18} /> Pilih Bioskop
          </label>
          <select
            value={selectedCinema ?? ""}
            onChange={(e) => setSelectedCinema(e.target.value)}
            className="border rounded-lg p-3 w-full"
          >
            <option value="">-- Pilih Bioskop --</option>
            {cinemas.map((cinema) => (
              <option key={cinema} value={cinema}>
                {cinema} (Rp{cinemaPrices[cinema].toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold mb-2 flex items-center gap-2">
              <Calendar size={18} /> Pilih Tanggal
            </label>
            <input
              type="date"
              value={selectedDate ?? ""}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="font-semibold mb-2 flex items-center gap-2">
              <Clock3 size={18} /> Pilih Jam Tayang
            </label>
            <div className="flex gap-2 flex-wrap">
              {showTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedTime === time
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Pilih Kursi</h2>
          <div className="inline-block border rounded-lg p-4 bg-gray-50">
            <div className="flex flex-col gap-2 items-center">
              <span className="mb-2 font-semibold text-gray-600">Layar</span>
              {rows.map((row) => (
                <div key={row} className="flex gap-2 items-center">
                  {cols.map((col) => {
                    const seat = `${row}${col}`;
                    const isOccupied = occupiedSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);
                    return (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        disabled={isOccupied}
                        className={`w-8 h-8 text-xs rounded ${
                          isOccupied
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                  <span className="ml-2">{row}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 mt-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-200 border"></div>
              <span>Kosong</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600"></div>
              <span>Dipilih</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-600"></div>
              <span>Terisi</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2">Ringkasan Pesanan</h3>
          <p>Cinema: {selectedCinema || "-"}</p>
          <p>Tanggal: {selectedDate || "-"}</p>
          <p>Jam: {selectedTime || "-"}</p>
          <p>
            Kursi: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
          </p>
          <p>Harga tiket: Rp{ticketPrice.toLocaleString()}</p>
          <p className="font-bold">Total: Rp{totalPrice.toLocaleString()}</p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={
            !selectedCinema ||
            !selectedDate ||
            !selectedTime ||
            selectedSeats.length === 0
          }
          className={`w-full px-6 py-3 rounded-lg shadow transition ${
            selectedCinema &&
            selectedDate &&
            selectedTime &&
            selectedSeats.length > 0
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Masukkan Keranjang
        </button>
      </div>
    </div>
  );
};

export default Checkout;

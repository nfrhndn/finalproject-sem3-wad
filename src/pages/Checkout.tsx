import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

interface Credits {
  crew: { job: string; name: string }[];
  cast: { name: string }[];
}

const cinemaPrices: Record<string, number> = {
  "CGV Mall Kota": 50000,
  "XXI Plaza Central": 60000,
  "Cinepolis Grand Square": 55000,
};

const Checkout = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeats] = useState<string[]>(["A2", "A3", "C7", "D8", "F5"]);
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=id-ID`
      );
      const data = await res.json();

      if (!data.overview || data.overview.trim() === "") {
        const resEn = await fetch(
          `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );
        const dataEn = await resEn.json();
        setMovie(dataEn);
      } else {
        setMovie(data);
      }

      const creditsRes = await fetch(
        `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=id-ID`
      );
      const creditsData = await creditsRes.json();
      setCredits(creditsData);

      const editItem = localStorage.getItem("editItem");
      if (editItem) {
        const parsed = JSON.parse(editItem);
        setSelectedCinema(parsed.cinema);
        setSelectedTime(parsed.time);
        setSelectedSeats(parsed.seats);
        localStorage.removeItem("editItem");
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
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const ticketPrice = selectedCinema ? cinemaPrices[selectedCinema] : 0;
  const totalPrice = selectedSeats.length * ticketPrice;

  const handleCheckout = () => {
    if (
      !movie ||
      !selectedCinema ||
      !selectedTime ||
      selectedSeats.length === 0
    )
      return;

    const order = {
      id: Date.now(),
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      cinema: selectedCinema,
      time: selectedTime,
      seats: selectedSeats,
      price: ticketPrice,
      total: totalPrice,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    existingCart.push(order);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-600 hover:text-cyan-600 mb-6"
      >
        ← Kembali
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg shadow-lg mb-4"
            />
            <div className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm">
              ⭐ {movie.vote_average.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          <h1 className="text-3xl font-bold">{movie.title}</h1>

          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g.id}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          <div className="bg-white border rounded-lg p-4 shadow">
            <h2 className="font-semibold text-lg mb-2">Sinopsis</h2>
            <p className="text-gray-700 leading-relaxed">
              {movie.overview && movie.overview.trim() !== ""
                ? movie.overview
                : "Sinopsis tidak tersedia."}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow">
            <h2 className="font-semibold text-lg mb-3">Informasi Film</h2>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
              <p>
                <strong>Sutradara:</strong>{" "}
                {credits?.crew.find((c) => c.job === "Director")?.name ||
                  "Tidak tersedia"}
              </p>
              <p>
                <strong>Bahasa:</strong> {movie.original_language}
              </p>
              <p>
                <strong>Pemeran:</strong>{" "}
                {credits?.cast
                  .slice(0, 3)
                  .map((c) => c.name)
                  .join(", ") || "Tidak tersedia"}
              </p>
              <p>
                <strong>Subtitle:</strong> Bahasa Indonesia, English
              </p>
              <p>
                <strong>Genre:</strong>{" "}
                {movie.genres.map((g) => g.name).join(", ")}
              </p>
              <p>
                <strong>Durasi:</strong> {movie.runtime} menit
              </p>
              <p>
                <strong>Tanggal Rilis:</strong> {movie.release_date}
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow">
            <h2 className="font-semibold text-lg mb-3">Pilih Bioskop</h2>
            <select
              value={selectedCinema ?? ""}
              onChange={(e) => setSelectedCinema(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">-- Pilih Bioskop --</option>
              {cinemas.map((cinema) => (
                <option key={cinema} value={cinema}>
                  {cinema}
                </option>
              ))}
            </select>
            {selectedCinema && (
              <p className="mt-3 text-sm text-cyan-600">
                Bioskop: <strong>{selectedCinema}</strong> <br />
                Harga per tiket:{" "}
                <strong>
                  Rp {cinemaPrices[selectedCinema].toLocaleString("id-ID")}
                </strong>
              </p>
            )}
          </div>

          <div className="bg-white border rounded-lg p-4 shadow">
            <h2 className="font-semibold text-lg mb-3">Pilih Jam Tayang</h2>
            <div className="flex flex-wrap gap-3">
              {showTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    selectedTime === time
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {selectedTime && (
              <p className="mt-3 text-sm text-cyan-600">
                Jam tayang dipilih: <strong>{selectedTime}</strong>
              </p>
            )}
          </div>

          <div className="bg-white border rounded-lg p-4 shadow text-center">
            <h2 className="font-semibold text-lg mb-3">Pilih Kursi</h2>
            <div className="bg-gray-300 text-gray-800 py-2 rounded mb-4">
              Layar
            </div>

            <div className="flex flex-col gap-3 items-center">
              {rows.map((row) => (
                <div key={row} className="flex gap-2">
                  {cols.map((col) => {
                    if (col === 7)
                      return <div key={`gap-${row}`} className="w-6"></div>;
                    const seat = `${row}${col}`;
                    const isOccupied = occupiedSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);

                    return (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        disabled={isOccupied}
                        className={`w-10 h-10 rounded-md border text-sm font-medium ${
                          isOccupied
                            ? "bg-green-500 text-white cursor-not-allowed"
                            : isSelected
                            ? "bg-cyan-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                  <span className="ml-2 text-sm">{row}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 border rounded"></div>{" "}
                Tersedia
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-cyan-600 rounded"></div> Dipilih
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded"></div> Terisi
              </div>
            </div>

            <div className="mt-4 text-lg font-semibold text-cyan-700">
              Total: Rp {totalPrice.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCheckout}
              disabled={
                !selectedCinema || !selectedTime || selectedSeats.length === 0
              }
              className={`flex-1 px-6 py-3 rounded-lg shadow transition ${
                selectedCinema && selectedTime && selectedSeats.length > 0
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Masukkan Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import { useState } from "react";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const order = {
    id: 1,
    title: "Spider-Man: No Way Home",
    cinema: "Cinema XXI Plaza Senayan",
    time: "19:00 WIB",
    price: 50000,
    poster:
      "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg",
  };

  const occupiedSeats = ["A1", "B5", "C3", "D7"];

  const rows = ["A", "B", "C", "D", "E", "F"];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  const toggleSeat = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const total = selectedSeats.length * order.price;

  return (
    <div className="container mx-auto px-4 py-10 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6 text-center text-cyan-600">
        Keranjang Pesanan
      </h1>


      {selectedSeats.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-center text-gray-600 text-lg font-medium">
            Anda belum melakukan pemesanan
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 p-4 bg-cyan-600 rounded-xl shadow-md mb-6 text-white">
            <img
              src={order.poster}
              alt={order.title}
              className="w-24 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{order.title}</h2>
              <p>{order.cinema}</p>
              <p>Jam: {order.time}</p>
              <p>
                Harga per tiket: Rp{order.price.toLocaleString()}
              </p>
              <p className="font-bold">
                Total: Rp{total.toLocaleString()}
              </p>
            </div>
            <button className="p-2 text-red-300 hover:text-red-500">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">Pilih Kursi</h2>

            <div className="bg-gray-300 h-6 mb-6 rounded-lg">LAYAR</div>

            <div className="inline-block space-y-3">
              {rows.map((row) => (
                <div key={row} className="flex justify-center gap-2">
                  {cols.map((col) => {
                    const seat = `${row}${col}`;
                    const isOccupied = occupiedSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);

                    return (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        disabled={isOccupied}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold
                          ${
                            isOccupied
                              ? "bg-red-500 text-white cursor-not-allowed"
                              : isSelected
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 hover:bg-cyan-400 hover:text-white"
                          }`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg shadow flex justify-between items-center">
              <p className="font-medium">
                Kursi dipilih: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
              </p>
              <p className="font-bold text-cyan-600">
                Total: Rp{total.toLocaleString()}
              </p>
            </div>

            <button
              disabled={selectedSeats.length === 0}
              className="mt-4 w-full py-3 bg-cyan-600 text-white font-semibold rounded-xl shadow hover:bg-cyan-700 transition disabled:opacity-50"
            >
              Lanjutkan ke Pembayaran
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

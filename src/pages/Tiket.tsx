import { useEffect, useState } from "react";
import { Ticket as TicketIcon, Calendar, Clock3, MapPin } from "lucide-react";
import { fetchTickets } from "../Services/api";

interface TicketItem {
  id: number;
  movieId: number;
  title: string;
  poster: string;
  cinema: string;
  time: string;
  date: string;
  seats: string[];
  total: number;
  bookingCode: string;
}

const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w200";

const Tiket = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchTickets();
        // Urutkan berdasarkan waktu ditambahkan terbaru
        if (res.success) {
          const sortedTickets = [...res.tickets].sort(
            (a: any, b: any) => b.id - a.id
          );
          setTickets(sortedTickets);
        }
      } catch (err) {
        console.error("Gagal load tiket:", err);
        setTickets([]);
      }
    };
    load();
  }, []);

  const getStatus = (date: string, time: string) => {
    const now = new Date();
    const ticketDateTime = new Date(`${date}T${time}:00`);

    if (ticketDateTime > now) {
      return { label: "Aktif", color: "bg-green-500" };
    } else if (
      ticketDateTime.toDateString() === now.toDateString() &&
      ticketDateTime < now
    ) {
      return { label: "Sudah Digunakan", color: "bg-gray-400" };
    } else {
      return { label: "Kadaluarsa", color: "bg-red-500" };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <TicketIcon className="text-cyan-600 w-7 h-7" />
        <h1 className="text-2xl font-bold text-cyan-700">
          Riwayat Tiket ({tickets.length})
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {tickets.length === 0 ? (
          <p className="text-gray-600 text-center">
            Belum ada tiket. Silakan lakukan pembayaran terlebih dahulu.
          </p>
        ) : (
            tickets.map((item) => {
              const status = getStatus(item.date, item.time);
              return (
                <div
                  key={item.id}
                className="relative bg-white border border-gray-300 shadow-md flex gap-4 items-stretch px-5 py-6 overflow-hidden rounded-lg"
                style={{
                  clipPath:
                    "path('M20 0 Hcalc(100% - 20px) C100% 20,100% 60,calc(100% - 20px) 80 H20 C0 60,0 20,20 0 Z')",
                }}
              >
                {/* Status Label */}
                <span
                  className={`absolute top-3 right-3 text-xs text-white px-3 py-1 rounded-full ${status.color}`}
                >
                  {status.label}
                </span>

                {/* Poster Film */}
                <img
                  src={`${TMDB_BASE_URL}${item.poster}`}
                  alt={item.title}
                  className="w-28 h-40 object-cover rounded-md shadow-sm self-end"
                />

                {/* Konten Tiket */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{item.title}</h2>
                    <p className="text-sm text-gray-500 mb-3">
                      Kode Booking: {item.bookingCode}
                    </p>

                    <div className="flex items-center text-sm text-gray-600 gap-8">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {item.cinema}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {formatDate(item.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock3 className="w-4 h-4" /> {item.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <p className="text-sm">
                      Kursi:{" "}
                      {item.seats.map((seat) => (
                        <span
                          key={seat}
                          className="inline-block bg-gray-200 px-2 py-1 rounded-md mr-2 text-xs"
                        >
                          {seat}
                        </span>
                      ))}
                    </p>

                    <span className="font-bold text-lg text-cyan-700">
                      Rp {item.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Tiket;

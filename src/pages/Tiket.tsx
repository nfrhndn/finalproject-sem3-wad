import { useEffect, useState } from "react";
import { Ticket as TicketIcon, Calendar, Clock3, MapPin } from "lucide-react";

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
    try {
      const storedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
      setTickets(storedTickets);
    } catch (error) {
      console.error("Gagal load tiket:", error);
      setTickets([]);
    }
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

  // Format tanggal ke dd-MM-yyyy
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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
            tickets
              .slice()
              .reverse() // tiket terbaru muncul di atas
              .map((item) => {
                const status = getStatus(item.date, item.time);
                return (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg p-5 shadow flex gap-4 items-start"
                  >
                    <img
                      src={`${TMDB_BASE_URL}${item.poster}`}
                      alt={item.title}
                      className="w-24 h-36 object-cover rounded-md"
                    />

                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      <p className="text-sm text-gray-500">
                        Kode Booking: {item.bookingCode}
                      </p>

                      <div className="flex items-center text-sm text-gray-600 gap-6 mt-2">
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

                      <p className="mt-2 text-sm">
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
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-lg text-cyan-700">
                        Rp {item.total.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={`text-xs text-white px-3 py-1 rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
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

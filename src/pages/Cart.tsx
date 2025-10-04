import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Pencil,
  Film,
  Clock3,
  Calendar,
  ChevronDown,
} from "lucide-react";

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

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedCart: CartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      setCart(storedCart.reverse());
    } catch (error) {
      console.error("Gagal parse cart:", error);
      setCart([]);
    }
  }, []);

  const handleRemove = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  const handleEdit = (item: CartItem) => {
    localStorage.setItem("editItem", JSON.stringify(item));
    navigate(`/checkout/${item.movieId}`);
  };

  const handleCheckbox = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDateDisplay = (iso?: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
  };

  const selectedCartItems = cart.filter((item) =>
    selectedItems.includes(item.id)
  );

  const totalAmount = selectedCartItems.reduce(
    (acc, item) => acc + (item.total ?? 0),
    0
  );

  const paymentOptions = [
    {
      category: "Bank",
      options: [
        { name: "Mandiri", icon: "/src/icons/mandiri.png" },
        { name: "BNI", icon: "/src/icons/bni.png" },
        { name: "Permata Bank", icon: "/src/icons/permata.png" },
        { name: "Bank BRI", icon: "/src/icons/bri.png" },
      ],
    },
    {
      category: "E-Wallet",
      options: [
        { name: "Gopay", icon: "/src/icons/gopay.png" },
        { name: "Dana", icon: "/src/icons/dana.png" },
        { name: "Ovo", icon: "/src/icons/ovo.png" },
      ],
    },
    {
      category: "QRIS",
      options: [{ name: "QRIS", icon: "/src/icons/qris.png" }],
    },
  ];

  const handlePayment = () => {
    if (selectedCartItems.length === 0 || !selectedPayment) return;

    const existingTickets = JSON.parse(localStorage.getItem("tickets") || "[]");

    const generateBookingCode = (prefix: string) =>
      prefix.toUpperCase().slice(0, 3) +
      Math.floor(100000 + Math.random() * 900000).toString();

    const newTickets = selectedCartItems.map((item) => ({
      ...item,
      bookingCode: generateBookingCode(item.title),
      poster: item.poster?.startsWith("http")
        ? item.poster
        : `https://image.tmdb.org/t/p/w500${item.poster}`,
    }));

    localStorage.setItem(
      "tickets",
      JSON.stringify([...existingTickets, ...newTickets])
    );

    const remainingCart = cart.filter(
      (item) => !selectedItems.includes(item.id)
    );
    setCart(remainingCart);
    localStorage.setItem("cart", JSON.stringify(remainingCart));

    alert("Pembayaran berhasil! Tiket sudah ditambahkan ke riwayat.");
    navigate("/tiket");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center gap-2 mb-8">
        <ShoppingCart className="text-cyan-600 w-7 h-7" />
        <h1 className="text-2xl font-bold text-cyan-700">Keranjang Saya</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          {cart.length === 0 ? (
            <p className="text-center text-gray-600">
              Keranjang masih kosong. Silakan pilih tiket terlebih dahulu.
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-5 shadow flex flex-col sm:flex-row gap-4"
              >
                <div className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckbox(item.id)}
                    className="mt-2 w-5 h-5"
                  />
                  <img
                    src={
                      item.poster?.startsWith("http")
                        ? item.poster
                        : `https://image.tmdb.org/t/p/w500${item.poster}`
                    }
                    alt={item.title}
                    className="w-24 h-32 object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-6 gap-y-2 mt-2">
                      <span className="flex items-center gap-1">
                        <Film className="w-4 h-4" /> {item.cinema}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />{" "}
                        {formatDateDisplay(item.date)}
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
                  <div className="mt-3">
                    <p className="text-sm text-gray-700 font-medium">
                      {item.seats.length} tiket × Rp{" "}
                      {(item.price ?? 0).toLocaleString("id-ID")}
                    </p>
                    <p className="font-bold text-lg text-cyan-700">
                      Rp {(item.total ?? 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="bg-white rounded-lg p-5 shadow h-fit sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Rincian Pesanan</h2>

            <div className="text-sm text-gray-700 flex flex-col gap-3">
              {selectedCartItems.length === 0 ? (
                <p className="text-gray-500">Belum ada tiket dipilih.</p>
              ) : (
                selectedCartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-1"
                  >
                    <span>
                      {item.seats.length} tiket - {item.title}
                    </span>
                    <span className="font-medium">
                      Rp {(item.total ?? 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))
              )}
            </div>

            <hr className="my-3 border-gray-300" />
            <div className="flex flex-col sm:flex-row justify-between sm:items-center font-bold text-lg text-cyan-700 gap-2">
              <span>Total</span>
              <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>

            <p className="mt-5 mb-2 text-sm font-semibold text-gray-700">
              Metode Pembayaran
            </p>

            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex justify-between items-center border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                {selectedPayment ? (
                  <span className="flex items-center gap-2">
                    <img
                      src={
                        paymentOptions
                          .flatMap((cat) => cat.options)
                          .find((opt) => opt.name === selectedPayment)?.icon
                      }
                      alt={selectedPayment}
                      className="w-20 h-8 object-contain"
                    />
                  </span>
                ) : (
                  <span>Pilih Metode Pembayaran</span>
                )}
                <ChevronDown className="w-5 h-5" />
              </button>

              {showDropdown && (
                <div className="mt-2 border border-gray-300 rounded-lg bg-white shadow p-3 space-y-4">
                  {paymentOptions.map((group) => (
                    <div key={group.category}>
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        {group.category}
                      </p>
                      <div
                        className={`grid gap-3 ${group.options.length > 1
                          ? "grid-cols-2"
                          : "grid-cols-1"
                          }`}
                      >
                        {group.options.map((opt) => (
                          <button
                            key={opt.name}
                            onClick={() => {
                              setSelectedPayment(opt.name);
                              setShowDropdown(false);
                            }}
                            className="flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 w-full h-14"
                          >
                            <img
                              src={opt.icon}
                              alt={opt.name}
                              className="max-h-10 object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={selectedCartItems.length === 0 || !selectedPayment}
              className={`w-full mt-5 px-4 py-3 rounded-lg font-medium shadow ${selectedCartItems.length > 0 && selectedPayment
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Bayar Sekarang
            </button>

            <button
              onClick={() => navigate("/film")}
              className="w-full mt-3 px-4 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Lanjut Belanja
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

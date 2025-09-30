import {
  Film,
  Sofa,
  Coffee,
  Ticket,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

export default function About() {
  const fasilitas = [
    {
      icon: <Film className="w-8 h-8 text-cyan-600" />,
      title: "Teknologi Studio",
      desc: "IMAX, Dolby Atmos, dan VIP",
    },
    {
      icon: <Sofa className="w-8 h-8 text-cyan-600" />,
      title: "Kursi Nyaman",
      desc: "Kursi empuk dengan legroom luas",
    },
    {
      icon: <Coffee className="w-8 h-8 text-cyan-600" />,
      title: "Snack Bar",
      desc: "Beragam pilihan makanan & minuman",
    },
    {
      icon: <Ticket className="w-8 h-8 text-cyan-600" />,
      title: "Pemesanan Online",
      desc: "Sistem cepat & aman",
    },
  ];

  const kontak = [
    {
      icon: <MapPin className="w-8 h-8 text-cyan-600" />,
      title: "Alamat",
      desc: "Jl. Sudirman No. 123, Jakarta Pusat",
    },
    {
      icon: <Phone className="w-8 h-8 text-cyan-600" />,
      title: "Telepon",
      desc: "081234567899",
    },
    {
      icon: <Mail className="w-8 h-8 text-cyan-600" />,
      title: "Email",
      desc: "cinemaplus@gmail.com",
    },
    {
      icon: <Clock className="w-8 h-8 text-cyan-600" />,
      title: "Jam Operasional",
      desc: "10.00 - 23.00 WIB",
    },
  ];
  
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-cyan-600">
        Tentang CinemaPlus
      </h1>

      <p className="text-gray-700 leading-relaxed mb-12 text-center max-w-4xl mx-auto text-lg">
        CinemaPlus adalah jaringan bioskop modern yang menghadirkan pengalaman
        menonton terbaik dengan teknologi audio-visual terkini. Kami berkomitmen
        memberikan hiburan berkualitas bagi seluruh keluarga dengan pilihan film
        lokal maupun internasional.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-8 text-cyan-600 text-center">
          Fasilitas Unggulan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {fasilitas.map(({ icon, title, desc }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center
                         transform transition-transform duration-300 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="mb-4">{icon}</div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-8 text-cyan-600 text-center">
          Hubungi Kami
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {kontak.map(({ icon, title, desc }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center
                         transform transition-transform duration-300 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="mb-4">{icon}</div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

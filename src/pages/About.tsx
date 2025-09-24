export default function About() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-cyan-600">
        Tentang CinemaPlus
      </h1>

      <p className="text-gray-700 leading-relaxed mb-6 text-center max-w-3xl mx-auto">
        CinemaPlus adalah jaringan bioskop modern yang menghadirkan pengalaman
        menonton terbaik dengan teknologi audio-visual terkini. Kami berkomitmen
        memberikan hiburan berkualitas bagi seluruh keluarga dengan pilihan film
        lokal maupun internasional.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-600">
          Fasilitas Unggulan
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            Ruang studio dengan teknologi <b>IMAX</b> , <b>Dolby Atmos</b> dan{" "}
            <b>VIP</b>
          </li>
          <li>Kursi empuk dengan legroom luas</li>
          <li>Snack bar dengan beragam pilihan makanan & minuman</li>
          <li>Pemesanan tiket online dengan sistem cepat & aman</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-cyan-600">
          Hubungi Kami
        </h2>
        <p className="text-gray-700 mb-2">
          📍 Alamat: Jl. Sudirman No. 123, Jakarta Pusat
        </p>
        <p className="text-gray-700 mb-2">📞 Telepon: 081311582032</p>
        <p className="text-gray-700 mb-2">✉️ Email: cinemaplus@gmail.com</p>
        <p className="text-gray-700">🕒 Jam Operasional: 10.00 - 23.00 WIB</p>
      </section>
    </div>
  );
}

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-cyan-600">404</h1>
      <p className="mt-4 text-lg">Halaman yang kamu cari tidak ditemukan.</p>
      <a
        href="/"
        className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
};

export default NotFound;

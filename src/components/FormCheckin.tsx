interface FormCheckinProps {
  onCheckin: (
    nomorPolisi: string,
    jenisKendaraan: string,
    estimasiJam: number,
    metode: string //
  ) => void;
}

export default function FormCheckin({ onCheckin }: FormCheckinProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const platNomor = formData.get("plat-nomor") as string;
    const jenis = formData.get("jenis-kendaraan") as string;
    const estimasi = parseInt(formData.get("estimasi-jam") as string, 10);
    const metode = formData.get("metode-bayar") as string; //

    if (!platNomor || !jenis || isNaN(estimasi) || !metode) {
      alert("Plat nomor, jenis kendaraan, estimasi jam, dan metode wajib diisi!");
      return;
    }

    onCheckin(platNomor.toUpperCase(), jenis, estimasi, metode);
    e.currentTarget.reset();
  }

  return (
    <div className="card">
      <h2 className="card-title">
        <i className="fas fa-sign-in-alt"></i> Masuk Parkir
      </h2>
      <form id="checkin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="plat-nomor">Plat Nomor Kendaraan</label>
          <input type="text" id="plat-nomor" name="plat-nomor" className="form-control" placeholder="B 1234 XYZ" required />
        </div>
        <div className="form-group">
          <label htmlFor="jenis-kendaraan">Jenis Kendaraan</label>
          <select id="jenis-kendaraan" name="jenis-kendaraan" className="form-control" required>
            <option value="">Pilih Jenis Kendaraan</option>
            <option value="mobil">Mobil</option>
            <option value="motor">Motor</option>
            <option value="truk">Truk</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="estimasi-jam">Estimasi Parkir</label>
          <select id="estimasi-jam" name="estimasi-jam" className="form-control" required>
            <option value="">Pilih Durasi</option>
            <option value="1">1 Jam</option>
            <option value="2">2 Jam</option>
            <option value="3">3 Jam</option>
            <option value="4">4 Jam</option>
            <option value="5">5 Jam</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="metode-bayar">Metode Pembayaran</label>
          <select id="metode-bayar" name="metode-bayar" className="form-control" required>
            <option value="">Pilih Metode</option>
            <option value="QRIS">QRIS</option>
            <option value="Cash">Cash</option>
            <option value="Debit">Debit</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary pulse">
          <i className="fas fa-check-circle"></i> Simpan & Cetak Tiket
        </button>
      </form>
    </div>
  );
}

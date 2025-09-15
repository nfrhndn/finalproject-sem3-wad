interface CheckoutInfo {
  duration: string;
  fee: number;
  method: string;
}

interface FormCheckoutProps {
  onCheckout: (nomorPolisi: string, kodeTiket: string, jenis: string) => void;
  checkoutInfo: CheckoutInfo | null;
}

export default function FormCheckout({ onCheckout, checkoutInfo }: FormCheckoutProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const platNomor = formData.get("plat-checkout") as string;
    const kodeTiket = formData.get("kode-tiket") as string;
    const jenis = formData.get("jenis-kendaraan") as string;

    if (!platNomor || !kodeTiket || !jenis) {
      alert("Kode tiket, plat nomor, dan jenis kendaraan wajib diisi!");
      return;
    }

    onCheckout(platNomor.toUpperCase(), kodeTiket, jenis);
    e.currentTarget.reset();
  }

  return (
    <div className="card">
      <h2 className="card-title">
        <i className="fas fa-sign-out-alt"></i> Keluar Parkir
      </h2>
      <form id="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="kode-tiket">Kode Tiket</label>
          <input
            type="text"
            id="kode-tiket"
            name="kode-tiket"
            className="form-control"
            placeholder="Masukkan kode tiket"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="plat-checkout">Plat Nomor</label>
          <input
            type="text"
            id="plat-checkout"
            name="plat-checkout"
            className="form-control"
            placeholder="B 1234 XYZ"
            required
          />
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
        {checkoutInfo && (
          <div className="checkout-info">
            <div><b>Durasi Parkir:</b> {checkoutInfo.duration}</div>
            <div><b>Biaya Parkir:</b> Rp {checkoutInfo.fee.toLocaleString()}</div>
            <div><b>Metode Pembayaran:</b> {checkoutInfo.method}</div>
          </div>
        )}
        <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          <i className="fas fa-money-bill-wave"></i> Bayar & Keluar
        </button>
      </form>
    </div>
  );
}

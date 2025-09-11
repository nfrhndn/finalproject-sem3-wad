import React, { useState } from "react";
import { Ticket } from "../types";

export default function KeluarForm() {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5001/api/exit-by-plate/${plate.trim()}`,
        { method: "POST" }
      );

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.message || body.error || "Request failed");
      }

      setResult(body);
      setPlate(""); // reset input setelah berhasil
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>🚦 Kendaraan Keluar</h3>
      <form onSubmit={handleExit}>
        <input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="Plat Nomor"
          required
        />
        <button type="submit" style={{ marginLeft: 10 }} disabled={loading}>
          {loading ? "Memproses..." : "Keluar"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: 15,
            padding: "10px",
            border: "1px solid #555",
            borderRadius: 6,
          }}
        >
          <p>
            ✅ <strong>{result.plate}</strong> berhasil keluar.
          </p>
          <p>Jenis: {result.vehicleType}</p>
          <p>Waktu Masuk: {new Date(result.entryTime).toLocaleString()}</p>
          <p>
            Waktu Keluar:{" "}
            {result.exitTime ? new Date(result.exitTime).toLocaleString() : "-"}
          </p>
          <p>
            Biaya Parkir:{" "}
            <strong>Rp {result.fee?.toLocaleString("id-ID")}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Ticket } from "../types";

export default function MasukForm() {
  const [plate, setPlate] = useState("");
  const [vehicleType, setVehicleType] = useState<"car" | "motorcycle">("car");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTicket(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plate: plate.trim(),
          vehicleType,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.message || "Request failed");
      }

      setTicket(body);
      setPlate("");

      // cetak tiket otomatis
      printTicket(body);
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  function printTicket(t: Ticket) {
    const w = window.open("", "_blank", "width=400,height=600");
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Tiket Parkir</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            p { margin: 5px 0; }
            hr { margin: 15px 0; }
          </style>
        </head>
        <body>
          <h2>Tiket Parkir</h2>
          <p><strong>ID:</strong> ${t.id}</p>
          <p><strong>Plat:</strong> ${t.plate}</p>
          <p><strong>Jenis Kendaraan:</strong> ${t.vehicleType}</p>
          <p><strong>Waktu Masuk:</strong> ${new Date(
            t.entryTime
          ).toLocaleString()}</p>
          <hr>
          <p style="text-align:center;">Terima kasih. Simpan tiket ini.</p>
        </body>
      </html>
    `);
    w.document.close();
    w.print();
  }

  return (
    <div>
      <h3>🚗 Kendaraan Masuk</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="Plat nomor"
          required
        />
        <select
          value={vehicleType}
          onChange={(e) =>
            setVehicleType(e.target.value as "car" | "motorcycle")
          }
          style={{ marginLeft: 10 }}
        >
          <option value="car">Mobil</option>
          <option value="motorcycle">Motor</option>
        </select>
        <button type="submit" style={{ marginLeft: 10 }} disabled={loading}>
          {loading ? "Memproses..." : "Cetak Tiket"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {ticket && (
        <div style={{ marginTop: 10 }}>
          <p>
            ✅ Tiket berhasil dibuat: ID <strong>{ticket.id}</strong>, Plat{" "}
            <strong>{ticket.plate}</strong>, Jenis{" "}
            <strong>{ticket.vehicleType}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

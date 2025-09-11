import React, { useEffect, useState } from "react";

export default function ParkingStatus() {
  const [status, setStatus] = useState<{
    total: number;
    occupied: number;
    available: number;
  } | null>(null);

  async function fetchStatus() {
    try {
      const res = await fetch("http://localhost:5001/api/status"); // 🔹 ganti ke 5001
      if (!res.ok) throw new Error("Gagal ambil status");
      const body = await res.json();
      setStatus(body);
    } catch (err) {
      console.error("Fetch status error:", err);
    }
  }

  useEffect(() => {
    fetchStatus();
    // optional: refresh setiap 10 detik
    const id = setInterval(fetchStatus, 10000);
    return () => clearInterval(id);
  }, []);

  if (!status) return <div>Loading status...</div>;

  return (
    <div>
      <h3>Status Parkir</h3>
      <h4>Mobil</h4>
      <p>Total: {status.car.total}</p>
      <p>Terisi: {status.car.occupied}</p>
      <p>Tersedia: {status.car.available}</p>

      <h4>Motor</h4>
      <p>Total: {status.motorcycle.total}</p>
      <p>Terisi: {status.motorcycle.occupied}</p>
      <p>Tersedia: {status.motorcycle.available}</p>

      <button onClick={fetchStatus}>Refresh</button>
    </div>
  );
}

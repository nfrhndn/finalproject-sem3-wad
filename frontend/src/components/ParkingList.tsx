import { useEffect, useState } from "react";

interface Parking {
  id: number;
  plate: string;
  vehicleType: "car" | "motorcycle";
  entryTime: string;
  exitTime?: string | null;
}

export default function ParkingList() {
  const [parkings, setParkings] = useState<Parking[]>([]);

  // fungsi ambil data dari server
  async function fetchData() {
    try {
      const res = await fetch("http://localhost:5001/api/tickets");
      const data = await res.json();
      setParkings(data.filter((t: any) => !t.exitTime)); // hanya yg masih parkir
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  }

  useEffect(() => {
    fetchData(); // load pertama kali

    // auto-refresh tiap 3 detik
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {parkings.length === 0 ? (
        <p>Tidak ada kendaraan saat ini.</p>
      ) : (
        <ul>
          {parkings.map((p) => (
            <li key={p.id}>
              <strong>{p.plate}</strong> ({p.vehicleType}) – masuk{" "}
              {new Date(p.entryTime).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import MasukForm from "./components/MasukForm";
import KeluarForm from "./components/KeluarForm";
import ParkingStatus from "./components/ParkingStatus";
import TicketsList from "./components/TicketsList";
import ParkingList from "./components/ParkingList";
import { Ticket } from "./types";

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  async function fetchTickets() {
    const res = await fetch("http://localhost:5001/api/tickets");
    const data = await res.json();
    setTickets(data);
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Sistem Parkir</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* kirim onSuccess supaya setelah submit bisa refresh */}
        <MasukForm onSuccess={fetchTickets} />
        <ParkingStatus />
        <KeluarForm onSuccess={fetchTickets} />
        <TicketsList />
      </div>

      <hr />

      <div style={{ marginTop: 20 }}>
        <h2>🚗🚲 Daftar Kendaraan Terparkir</h2>
        <ParkingList tickets={tickets} />
      </div>
    </div>
  );
}

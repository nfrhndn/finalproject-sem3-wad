import React, { useEffect, useState } from "react";
import { Ticket } from "../types";

export default function TicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  async function load() {
    const res = await fetch("http://localhost:5001/api/tickets");
    const body = await res.json();
    setTickets(body);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h3>All Tickets</h3>
      <button onClick={load}>Reload</button>
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            #{t.id} {t.plate} ({t.vehicleType}) - masuk:{" "}
            {new Date(t.entryTime).toLocaleString()}{" "}
            {t.exitTime
              ? `- keluar: ${new Date(t.exitTime).toLocaleString()} fee: Rp${
                  t.fee
                }`
              : "(masih parkir)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

import React, { useState } from "react";
import Header from "./components/Header";
import ParkingStatus from "./components/ParkingStatus";
import FormCheckin from "./components/FormCheckin";
import FormCheckout from "./components/FormCheckout";
import ActivityLog from "./components/ActivityLog";

interface Slot {
  id: string;
  occupied: boolean;
  plate?: string;
  vehicleType?: string;
  checkinTime?: Date;
  ticketCode?: string;
  paymentMethod?: string;
}

interface Log {
  time: string;
  message: string;
}

interface CheckoutInfo {
  duration: string;
  fee: number;
  method: string;
}

// tarif per jam
const tarif: Record<string, number> = {
  mobil: 5000,
  motor: 3000,
  truk: 8000,
};

// generate kode tiket simple
function generateTicketCode(slot: string) {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${slot}-${random}`;
}

export default function App() {
  const [slots, setSlots] = useState<Slot[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: `A-0${i + 1}`,
      occupied: false,
    }))
  );
  const [logs, setLogs] = useState<Log[]>([]);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);

  // Handler checkin
  function handleCheckin(
    nomorPolisi: string,
    jenisKendaraan: string,
    estimasiJam: number,
    metode: string //
  ) {
    const slotIndex = slots.findIndex((s) => !s.occupied);
    if (slotIndex === -1) {
      alert("Semua slot penuh!");
      return;
    }

    const newSlots = [...slots];
    const slotId = newSlots[slotIndex].id;
    const ticketCode = generateTicketCode(slotId);

    newSlots[slotIndex] = {
      ...newSlots[slotIndex],
      occupied: true,
      plate: nomorPolisi,
      vehicleType: jenisKendaraan,
      checkinTime: new Date(),
      ticketCode,
      paymentMethod: metode, //
    };

    setSlots(newSlots);
    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString("id-ID"),
        message: `Kendaraan ${jenisKendaraan.toUpperCase()} ${nomorPolisi} masuk ke slot ${slotId}, tiket: ${ticketCode}, estimasi: ${estimasiJam} jam, metode: ${metode}`,
      },
      ...prev,
    ]);

    alert(`Tiket berhasil dicetak!\nKode Tiket: ${ticketCode}`);
  }

  // Handler checkout
  function handleCheckout(
    nomorPolisi: string,
    kodeTiket: string,
    jenis: string
  ) {
    const slotIndex = slots.findIndex(
      (s) => s.plate === nomorPolisi && s.ticketCode === kodeTiket
    );
    if (slotIndex === -1) {
      alert("Kendaraan tidak ditemukan atau kode tiket salah!");
      return;
    }

    const kendaraan = slots[slotIndex];
    const checkinTime = kendaraan.checkinTime!;
    const checkoutTime = new Date();

    const durasiMs = checkoutTime.getTime() - checkinTime.getTime();
    const jam = Math.floor(durasiMs / (1000 * 60 * 60));
    const menit = Math.floor((durasiMs % (1000 * 60 * 60)) / (1000 * 60));
    const durasi = `${jam} Jam ${menit} Menit`;

    const tarifPerJam = tarif[jenis] || 5000;
    const totalBayar = Math.max(1, jam) * tarifPerJam;

    const metode = kendaraan.paymentMethod || "QRIS"; // ✅ ambil dari checkin

    const newSlots = [...slots];
    newSlots[slotIndex] = { id: kendaraan.id, occupied: false };
    setSlots(newSlots);

    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString("id-ID"),
        message: `Kendaraan ${jenis.toUpperCase()} ${nomorPolisi} keluar dari slot ${kendaraan.id}. Durasi: ${durasi}, Biaya: Rp ${totalBayar.toLocaleString()}, Metode: ${metode}`,
      },
      ...prev,
    ]);

    setCheckoutInfo({
      duration: durasi,
      fee: totalBayar,
      method: metode,
    });

    alert("Pembayaran berhasil! Terima kasih telah menggunakan layanan kami.");
  }

  return (
    <div className="container">
      <Header />
      <div className="dashboard">
        <ParkingStatus slots={slots} />
        <FormCheckin onCheckin={handleCheckin} />
      </div>
      <div className="bottom-panel">
        <FormCheckout onCheckout={handleCheckout} checkoutInfo={checkoutInfo} />
        <ActivityLog logs={logs} />
      </div>
    </div>
  );
}

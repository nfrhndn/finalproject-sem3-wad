import express, { Request, Response } from "express";
import cors from "cors";

type Ticket = {
  id: number;
  plate: string;
  vehicleType: "car" | "motorcycle";
  entryTime: string; // ISO string
  exitTime?: string;
  fee?: number;
  paid?: boolean;
};

const app = express();
app.use(cors());
app.use(express.json());

const tickets: Ticket[] = [];
let nextId = 1;

const CAPACITY = {
  car: 50,
  motorcycle: 100,
};

function calculateFee(
  entryIso: string,
  exitIso: string,
  type: "car" | "motorcycle"
) {
  const entry = new Date(entryIso).getTime();
  const exit = new Date(exitIso).getTime();
  const durationHours = Math.max(
    1,
    Math.ceil((exit - entry) / (1000 * 60 * 60))
  );

  // tarif beda
  const ratePerHour = type === "car" ? 5000 : 2000;
  return durationHours * ratePerHour;
}

/** Health check */
app.get("/api", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "Parking API running" });
});

/** Kendaraan masuk */
app.post("/api/enter", (req: Request, res: Response) => {
  const { plate, vehicleType } = req.body;
  if (!plate || !vehicleType) {
    return res
      .status(400)
      .json({ error: "Plat & jenis kendaraan wajib diisi" });
  }

  const occupied = tickets.filter(
    (t) => !t.exitTime && t.vehicleType === vehicleType
  ).length;
  if (occupied >= CAPACITY[vehicleType]) {
    return res.status(400).json({ error: `Parkiran ${vehicleType} penuh` });
  }

  const ticket: Ticket = {
    id: nextId++,
    plate,
    vehicleType,
    entryTime: new Date().toISOString(),
    paid: false,
  };
  tickets.push(ticket);
  res.status(201).json(ticket);
});

/** Kendaraan keluar pakai plat */
app.post("/api/exit-by-plate/:plate", (req: Request, res: Response) => {
  const plate = req.params.plate;
  const ticket = tickets.find((t) => t.plate === plate && !t.exitTime);

  if (!ticket) {
    return res
      .status(404)
      .json({ error: "Kendaraan tidak ditemukan / sudah keluar" });
  }

  const exitTime = new Date().toISOString();
  const fee = calculateFee(ticket.entryTime, exitTime, ticket.vehicleType);

  ticket.exitTime = exitTime;
  ticket.fee = fee;
  ticket.paid = true;

  res.json(ticket);
});

/** Status */
app.get("/api/status", (_req: Request, res: Response) => {
  const carOccupied = tickets.filter(
    (t) => !t.exitTime && t.vehicleType === "car"
  ).length;
  const motoOccupied = tickets.filter(
    (t) => !t.exitTime && t.vehicleType === "motorcycle"
  ).length;

  res.json({
    car: {
      total: CAPACITY.car,
      occupied: carOccupied,
      available: CAPACITY.car - carOccupied,
    },
    motorcycle: {
      total: CAPACITY.motorcycle,
      occupied: motoOccupied,
      available: CAPACITY.motorcycle - motoOccupied,
    },
  });
});

app.get("/", (req, res) => {
  res.send("Backend Sistem Parkir sudah jalan 🚗🅿️");
});

/** List semua tiket */
app.get("/api/tickets", (_req: Request, res: Response) => {
  res.json(tickets);
});

const PORT = Number(process.env.PORT || 5001);
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

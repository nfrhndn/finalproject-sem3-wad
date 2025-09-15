interface ParkingSlot {
  id: string;
  occupied: boolean;
  plate?: string;
  vehicleType?: string; //
}

interface ParkingStatusProps {
  slots: ParkingSlot[];
}

export default function ParkingStatus({ slots }: ParkingStatusProps) {
  const total = slots.length;
  const terisi = slots.filter((s) => s.occupied).length;
  const tersedia = total - terisi;
  const kapasitas = ((terisi / total) * 100).toFixed(0);

  return (
    <div className="card">
      <h2 className="card-title"><i className="fas fa-car"></i> Status Parkir</h2>
      <div className="stats-container">
        <div className="stat-card"><div className="stat-value">{total}</div><div className="stat-label">Total Slot</div></div>
        <div className="stat-card"><div className="stat-value">{tersedia}</div><div className="stat-label">Tersedia</div></div>
        <div className="stat-card"><div className="stat-value">{terisi}</div><div className="stat-label">Terisi</div></div>
        <div className="stat-card"><div className="stat-value">{kapasitas}%</div><div className="stat-label">Kapasitas</div></div>
      </div>

      <div className="parking-grid">
        {slots.map((slot) => (
          <div key={slot.id} className={`parking-slot ${slot.occupied ? "occupied" : ""}`}>
            <i className="fas fa-car slot-icon"></i>
            <div className="slot-number">{slot.id}</div>
            <span className={`slot-status ${slot.occupied ? "occupied" : "available"}`}>
              {slot.occupied
                ? `Terisi (${slot.vehicleType ? slot.vehicleType.charAt(0).toUpperCase() + slot.vehicleType.slice(1) : ""})`
                : "Tersedia"}
            </span>

          </div>
        ))}
      </div>
    </div>
  );
}

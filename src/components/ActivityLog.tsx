interface Log {
  time: string;
  message: string;
}

interface ActivityLogProps {
  logs: Log[];
}

export default function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <div className="card">
      <h2 className="card-title">
        <i className="fas fa-history"></i> Aktivitas Terbaru
      </h2>
      <div className="activity-log">
        {logs.length === 0 ? (
          <div className="activity-item">
            <div className="activity-text">Belum ada aktivitas</div>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="activity-item">
              <div className="activity-time">{log.time}</div>
              <div className="activity-text">{log.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

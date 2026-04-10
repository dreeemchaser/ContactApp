const ActivityLog = ({ log }) => (
  <div className="section">
    <h2>Live Activity Log</h2>
    {log.length === 0 ? (
      <p style={{ color: '#4a5568', fontSize: '0.85rem' }}>No activity yet...</p>
    ) : (
      <div className="log-list">
        {log.map((entry, i) => (
          <div className="log-item" key={i}>
            <span className="log-time">{entry.time}</span>
            <span className="log-method">{entry.method}</span>
            <span className="log-path">{entry.path}</span>
            <span className={`log-status ${entry.status === 'ERR' || entry.status >= 400 ? 'err' : 'ok'}`}>
              {entry.status}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ActivityLog;

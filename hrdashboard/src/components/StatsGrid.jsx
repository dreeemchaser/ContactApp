const StatsGrid = ({ stats }) => (
  <div className="grid">
    <div className="card">
      <h3>Total Employees</h3>
      <div className="value">{stats ? stats.total : '—'}</div>
      <div className="sub">Stored in database</div>
    </div>
    <div className="card">
      <h3>Total Pages</h3>
      <div className="value">{stats ? stats.pages : '—'}</div>
      <div className="sub">At default page size of 10</div>
    </div>
    <div className="card">
      <h3>Employee Frontend</h3>
      <div className="value" style={{ fontSize: '1rem', paddingTop: '0.5rem' }}>localhost:3000</div>
      <div className="sub">React 18 + React Router v7</div>
    </div>
    <div className="card">
      <h3>Backend API</h3>
      <div className="value" style={{ fontSize: '1rem', paddingTop: '0.5rem' }}>localhost:8080</div>
      <div className="sub">Spring Boot 3.5 + PostgreSQL</div>
    </div>
  </div>
);

export default StatsGrid;

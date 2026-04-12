import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import StatsGrid from './components/StatsGrid';
import EndpointReference from './components/EndpointReference';
import ActivityLog from './components/ActivityLog';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [health, setHealth] = useState('checking');
  const [stats, setStats] = useState(null);
  const [log, setLog] = useState([]);
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');

  const addLog = useCallback((method, path, status) => {
    setLog(prev => [{ time: new Date().toLocaleTimeString(), method, path, status }, ...prev].slice(0, 50));
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      await axios.get(`${API}/actuator/health`);
      setHealth('up');
      addLog('GET', '/actuator/health', 200);
    } catch {
      setHealth('down');
      addLog('GET', '/actuator/health', 'ERR');
    }
  }, [addLog]);

  const fetchStats = useCallback(async (jwt) => {
    if (!jwt) return;
    try {
      const res = await axios.get(`${API}/contacts?page=0&size=1`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      const page = res.data.page || res.data;
      setStats({ total: page.totalElements ?? '—', pages: page.totalPages ?? '—' });
      addLog('GET', '/contacts?page=0&size=1', 200);
    } catch (e) {
      addLog('GET', '/contacts', e.response?.status || 'ERR');
    }
  }, [addLog]);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  useEffect(() => {
    if (token) {
      fetchStats(token);
      const interval = setInterval(() => fetchStats(token), 10000);
      return () => clearInterval(interval);
    }
  }, [token, fetchStats]);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    setToken(tokenInput.trim());
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>ContactApp Dashboard</h1>
        <span className={`status-badge ${health}`}>API {health.toUpperCase()}</span>
      </div>

      {!token && (
        <div className="section" style={{ marginBottom: '1.5rem' }}>
          <h2>Paste JWT Token to load live stats</h2>
          <form onSubmit={handleTokenSubmit} style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="eyJhbGci..."
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              style={{ flex: 1, padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid #4a5568', background: '#2d3748', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
            <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', background: '#3182ce', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Load
            </button>
          </form>
        </div>
      )}

      <StatsGrid stats={stats} />
      <EndpointReference />
      <ActivityLog log={log} />
      <p className="refresh-note">Auto-refreshes every 10 seconds</p>
    </div>
  );
}

export default App;

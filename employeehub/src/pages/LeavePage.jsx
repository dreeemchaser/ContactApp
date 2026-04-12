import { useState } from 'react';
import TopBar from '../components/TopBar';

const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Family Responsibility', 'Maternity Leave', 'Parental Leave', 'Study Leave'];

const MOCK_BALANCES = [
  { type: 'Annual Leave',          total: 15, used: 5,  color: 'blue' },
  { type: 'Sick Leave',            total: 30, used: 2,  color: 'red' },
  { type: 'Family Responsibility', total: 3,  used: 0,  color: 'amber' },
  { type: 'Study Leave',           total: 10, used: 0,  color: 'green' },
];

const MOCK_HISTORY = [
  { id: 1, type: 'Annual Leave',  from: '2026-03-10', to: '2026-03-14', days: 5, status: 'approved',  reason: 'Family vacation' },
  { id: 2, type: 'Sick Leave',    from: '2026-02-03', to: '2026-02-04', days: 2, status: 'approved',  reason: 'Flu' },
  { id: 3, type: 'Annual Leave',  from: '2026-05-01', to: '2026-05-03', days: 3, status: 'pending',   reason: 'Personal' },
];

const EMPTY_FORM = { leaveType: '', startDate: '', endDate: '', reason: '' };

export default function LeavePage() {
  const [tab, setTab]         = useState('overview');
  const [form, setForm]       = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const calcDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const diff = (new Date(form.endDate) - new Date(form.startDate)) / 86400000;
    return diff < 0 ? 0 : diff + 1;
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Will call API once backend is ready
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm(EMPTY_FORM); setTab('history'); }, 1500);
  };

  return (
    <>
      <TopBar title='Leave Management' breadcrumb='Employee Hub / Leave' />
      <div className='page'>

        {/* Tabs */}
        <div className='profile-tabs' style={{ marginBottom: '1.5rem' }}>
          {[['overview', 'Overview'], ['apply', 'Apply for Leave'], ['history', 'History']].map(([key, label]) => (
            <button key={key} className={`profile-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <>
            <div className='stat-grid' style={{ marginBottom: '1.5rem' }}>
              {MOCK_BALANCES.map(b => {
                const remaining = b.total - b.used;
                const pct = Math.round((remaining / b.total) * 100);
                return (
                  <div className='card' key={b.type} style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{b.type}</p>
                        <p style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: 1 }}>{remaining}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>of {b.total} days remaining</p>
                      </div>
                      <div className={`stat-card__icon stat-card__icon--${b.color}`}>
                        <i className='bi bi-calendar-check'></i>
                      </div>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: `var(--${b.color === 'blue' ? 'brand' : b.color})`, borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='card'>
              <div className='card__header'>
                <span className='card__title'>Recent Requests</span>
                <button className='btn btn-sm' onClick={() => setTab('apply')}><i className='bi bi-plus-lg'></i> Apply</button>
              </div>
              <div className='table-wrap'>
                <table>
                  <thead>
                    <tr>
                      <th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_HISTORY.slice(0, 3).map(r => (
                      <tr key={r.id}>
                        <td>{r.type}</td>
                        <td>{r.from}</td>
                        <td>{r.to}</td>
                        <td>{r.days}</td>
                        <td><span className={`badge badge--${r.status}`}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Apply ── */}
        {tab === 'apply' && (
          <div className='card' style={{ maxWidth: 600 }}>
            <div className='card__header'>
              <span className='card__title'>Apply for Leave</span>
            </div>
            <div className='card__body'>
              {submitted && <p className='feedback feedback--success'><i className='bi bi-check-circle'></i> Leave request submitted successfully.</p>}
              <form onSubmit={handleSubmit}>
                <div className='form-grid'>
                  <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                    <label className='form-label'>Leave Type</label>
                    <select className='form-control' name='leaveType' value={form.leaveType} onChange={set} required>
                      <option value=''>— Select type —</option>
                      {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className='form-group'>
                    <label className='form-label'>Start Date</label>
                    <input className='form-control' type='date' name='startDate' value={form.startDate} onChange={set} required />
                  </div>
                  <div className='form-group'>
                    <label className='form-label'>End Date</label>
                    <input className='form-control' type='date' name='endDate' value={form.endDate} onChange={set} required />
                  </div>
                  {calcDays() > 0 && (
                    <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                      <p style={{ fontSize: '0.83rem', color: 'var(--brand)', fontWeight: 600 }}>
                        <i className='bi bi-info-circle'></i> {calcDays()} working day{calcDays() !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                    <label className='form-label'>Reason</label>
                    <textarea className='form-control' name='reason' value={form.reason} onChange={set} rows={3} placeholder='Brief reason for leave...' />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button type='button' className='btn btn-ghost' onClick={() => setForm(EMPTY_FORM)}>Clear</button>
                  <button type='submit' className='btn'><i className='bi bi-send'></i> Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── History ── */}
        {tab === 'history' && (
          <div className='card'>
            <div className='card__header'>
              <span className='card__title'>Leave History</span>
              <button className='btn btn-sm' onClick={() => setTab('apply')}><i className='bi bi-plus-lg'></i> Apply</button>
            </div>
            <div className='table-wrap'>
              <table>
                <thead>
                  <tr>
                    <th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HISTORY.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No leave requests yet.</td></tr>
                  ) : MOCK_HISTORY.map(r => (
                    <tr key={r.id}>
                      <td>{r.type}</td>
                      <td>{r.from}</td>
                      <td>{r.to}</td>
                      <td>{r.days}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{r.reason}</td>
                      <td><span className={`badge badge--${r.status}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

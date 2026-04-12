import { useState } from 'react';
import TopBar from '../components/TopBar';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const MOCK_HISTORY = [
  { id: 1, week: '2026-03-30', total: 40, status: 'approved' },
  { id: 2, week: '2026-04-06', total: 38, status: 'pending' },
];

const emptyEntries = () => DAYS.map(day => ({ day, hours: '', description: '' }));

export default function TimesheetsPage() {
  const [tab, setTab]       = useState('log');
  const [entries, setEntries] = useState(emptyEntries());
  const [submitted, setSubmitted] = useState(false);

  const totalHours = entries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0);

  const updateEntry = (i, field, value) => {
    const updated = [...entries];
    updated[i] = { ...updated[i], [field]: value };
    setEntries(updated);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setEntries(emptyEntries()); setTab('history'); }, 1500);
  };

  return (
    <>
      <TopBar title='Timesheets' breadcrumb='Employee Hub / Timesheets' />
      <div className='page'>

        <div className='profile-tabs' style={{ marginBottom: '1.5rem' }}>
          {[['log', 'Log Hours'], ['history', 'History']].map(([key, label]) => (
            <button key={key} className={`profile-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Log Hours ── */}
        {tab === 'log' && (
          <div className='card' style={{ maxWidth: 700 }}>
            <div className='card__header'>
              <span className='card__title'>Weekly Timesheet</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Week of {new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className='card__body'>
              {submitted && <p className='feedback feedback--success'><i className='bi bi-check-circle'></i> Timesheet submitted for approval.</p>}
              <form onSubmit={handleSubmit}>
                <table>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th style={{ width: 90 }}>Hours</th>
                      <th>Description / Task</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, i) => (
                      <tr key={entry.day}>
                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{entry.day}</td>
                        <td>
                          <input
                            className='form-control'
                            type='number'
                            min='0'
                            max='24'
                            step='0.5'
                            placeholder='0'
                            value={entry.hours}
                            onChange={e => updateEntry(i, 'hours', e.target.value)}
                            style={{ height: 36, textAlign: 'center' }}
                          />
                        </td>
                        <td>
                          <input
                            className='form-control'
                            type='text'
                            placeholder='What did you work on?'
                            value={entry.description}
                            onChange={e => updateEntry(i, 'description', e.target.value)}
                            style={{ height: 36 }}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td style={{ fontWeight: 700, paddingTop: '0.75rem' }}>Total</td>
                      <td style={{ fontWeight: 700, color: totalHours >= 40 ? 'var(--green)' : 'var(--brand)', paddingTop: '0.75rem', textAlign: 'center' }}>
                        {totalHours}h
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button type='button' className='btn btn-ghost' onClick={() => setEntries(emptyEntries())}>Clear</button>
                  <button type='submit' className='btn' disabled={totalHours === 0}>
                    <i className='bi bi-send'></i> Submit for Approval
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── History ── */}
        {tab === 'history' && (
          <div className='card'>
            <div className='card__header'>
              <span className='card__title'>Timesheet History</span>
              <button className='btn btn-sm' onClick={() => setTab('log')}><i className='bi bi-plus-lg'></i> New</button>
            </div>
            <div className='table-wrap'>
              <table>
                <thead>
                  <tr><th>Week Starting</th><th>Total Hours</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {MOCK_HISTORY.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No timesheets submitted yet.</td></tr>
                  ) : MOCK_HISTORY.map(t => (
                    <tr key={t.id}>
                      <td>{t.week}</td>
                      <td>{t.total}h</td>
                      <td><span className={`badge badge--${t.status}`}>{t.status}</span></td>
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

import { useState } from 'react';
import TopBar from '../components/TopBar';

const MOCK_PAYSLIPS = [
  { id: 1, month: 'March 2026',    gross: 45000, paye: 9225,  uif: 177.12, net: 35597.88 },
  { id: 2, month: 'February 2026', gross: 45000, paye: 9225,  uif: 177.12, net: 35597.88 },
  { id: 3, month: 'January 2026',  gross: 45000, paye: 9225,  uif: 177.12, net: 35597.88 },
];

const fmt = n => `R ${Number(n).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

const CURRENT = MOCK_PAYSLIPS[0];
const ANNUAL_GROSS = MOCK_PAYSLIPS.reduce((s, p) => s + p.gross, 0);
const ANNUAL_TAX   = MOCK_PAYSLIPS.reduce((s, p) => s + p.paye, 0);
const ANNUAL_NET   = MOCK_PAYSLIPS.reduce((s, p) => s + p.net, 0);

export default function SalaryPage() {
  const [tab, setTab]       = useState('overview');
  const [selected, setSelected] = useState(null);

  return (
    <>
      <TopBar title='Salary' breadcrumb='Employee Hub / Salary' />
      <div className='page'>

        <div className='profile-tabs' style={{ marginBottom: '1.5rem' }}>
          {[['overview', 'Overview'], ['payslips', 'Payslips']].map(([key, label]) => (
            <button key={key} className={`profile-tab${tab === key ? ' active' : ''}`} onClick={() => { setTab(key); setSelected(null); }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <>
            <div className='stat-grid' style={{ marginBottom: '1.5rem' }}>
              {[
                { label: 'Current Monthly Gross', value: fmt(CURRENT.gross), icon: 'bi-cash-coin',    color: 'blue' },
                { label: 'Current Net Pay',        value: fmt(CURRENT.net),   icon: 'bi-wallet2',      color: 'green' },
                { label: 'YTD Tax (PAYE)',          value: fmt(ANNUAL_TAX),    icon: 'bi-receipt',      color: 'red' },
                { label: 'YTD Total Earned',        value: fmt(ANNUAL_GROSS),  icon: 'bi-graph-up',     color: 'amber' },
              ].map(s => (
                <div className='stat-card' key={s.label}>
                  <div className={`stat-card__icon stat-card__icon--${s.color}`}><i className={`bi ${s.icon}`}></i></div>
                  <div>
                    <div className='stat-card__value' style={{ fontSize: '1.1rem' }}>{s.value}</div>
                    <div className='stat-card__label'>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Latest payslip breakdown */}
            <div className='card' style={{ maxWidth: 480 }}>
              <div className='card__header'><span className='card__title'>Latest Payslip — {CURRENT.month}</span></div>
              <div className='card__body'>
                {[
                  { label: 'Basic Salary',  value: fmt(CURRENT.gross), bold: false },
                  { label: 'PAYE Tax',      value: `- ${fmt(CURRENT.paye)}`,  bold: false, red: true },
                  { label: 'UIF',           value: `- ${fmt(CURRENT.uif)}`,   bold: false, red: true },
                  { label: 'Net Pay',       value: fmt(CURRENT.net),   bold: true },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{row.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: row.bold ? 700 : 400, color: row.red ? 'var(--red)' : row.bold ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Payslips ── */}
        {tab === 'payslips' && !selected && (
          <div className='card'>
            <div className='card__header'><span className='card__title'>Payslip History</span></div>
            <div className='table-wrap'>
              <table>
                <thead>
                  <tr><th>Month</th><th>Gross</th><th>PAYE</th><th>UIF</th><th>Net Pay</th><th></th></tr>
                </thead>
                <tbody>
                  {MOCK_PAYSLIPS.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.month}</td>
                      <td>{fmt(p.gross)}</td>
                      <td style={{ color: 'var(--red)' }}>{fmt(p.paye)}</td>
                      <td style={{ color: 'var(--red)' }}>{fmt(p.uif)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--green)' }}>{fmt(p.net)}</td>
                      <td>
                        <button className='btn btn-ghost btn-sm' onClick={() => setSelected(p)}>
                          <i className='bi bi-eye'></i> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Payslip Detail ── */}
        {tab === 'payslips' && selected && (
          <div className='card' style={{ maxWidth: 480 }}>
            <div className='card__header'>
              <span className='card__title'>Payslip — {selected.month}</span>
              <button className='btn btn-ghost btn-sm' onClick={() => setSelected(null)}><i className='bi bi-arrow-left'></i> Back</button>
            </div>
            <div className='card__body'>
              {[
                { label: 'Basic Salary', value: fmt(selected.gross) },
                { label: 'PAYE Tax',     value: `- ${fmt(selected.paye)}`,  red: true },
                { label: 'UIF',          value: `- ${fmt(selected.uif)}`,   red: true },
                { label: 'Net Pay',      value: fmt(selected.net), bold: true },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: row.bold ? 700 : 400, color: row.red ? 'var(--red)' : row.bold ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

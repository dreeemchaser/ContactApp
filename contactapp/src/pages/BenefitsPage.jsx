import { useState } from 'react';
import TopBar from '../components/TopBar';

const MOCK_ACTIVE = [
  { id: 1, name: 'Medical Aid',  contribution: 'R 1,500 / month', employer: 'R 2,000 / month', status: 'active' },
  { id: 2, name: 'Pension Fund', contribution: '7.5% of salary',  employer: '10% of salary',   status: 'active' },
];

const MOCK_AVAILABLE = [
  { id: 3, name: 'Life Cover',       description: 'Group life insurance — 3x annual salary cover.',    contribution: 'R 250 / month' },
  { id: 4, name: 'Disability Cover', description: 'Income protection up to 75% of monthly salary.',   contribution: 'R 180 / month' },
  { id: 5, name: 'Study Assistance', description: 'Up to R 20,000 per year towards approved studies.', contribution: 'R 0 (employer funded)' },
];

export default function BenefitsPage() {
  const [applied, setApplied] = useState([]);

  const handleApply = id => setApplied(prev => [...prev, id]);

  return (
    <>
      <TopBar title='Benefits' breadcrumb='Employee Hub / Benefits' />
      <div className='page'>

        {/* Active benefits */}
        <div className='card' style={{ marginBottom: '1.5rem' }}>
          <div className='card__header'><span className='card__title'>My Active Benefits</span></div>
          <div className='table-wrap'>
            <table>
              <thead>
                <tr><th>Benefit</th><th>My Contribution</th><th>Employer Contribution</th><th>Status</th></tr>
              </thead>
              <tbody>
                {MOCK_ACTIVE.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 500 }}>{b.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{b.contribution}</td>
                    <td style={{ color: 'var(--green)' }}>{b.employer}</td>
                    <td><span className='badge badge--active'>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available benefits */}
        <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Available to Apply
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {MOCK_AVAILABLE.map(b => {
            const isApplied = applied.includes(b.id);
            return (
              <div className='card' key={b.id} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.name}</p>
                  {isApplied && <span className='badge badge--pending'>Applied</span>}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{b.description}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--brand)', fontWeight: 600, marginBottom: '1rem' }}>{b.contribution}</p>
                <button
                  className='btn btn-sm'
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={isApplied}
                  onClick={() => handleApply(b.id)}
                >
                  {isApplied ? 'Application Submitted' : <><i className='bi bi-plus-lg'></i> Apply</>}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}

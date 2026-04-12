import { useState } from 'react';
import TopBar from '../components/TopBar';

const MOCK_GOALS = [
  { id: 1, title: 'Complete React certification',       cycle: 'Q1 2026', due: '2026-03-31', status: 'completed' },
  { id: 2, title: 'Lead frontend architecture review',  cycle: 'Q2 2026', due: '2026-06-30', status: 'in_progress' },
  { id: 3, title: 'Mentor junior developer',            cycle: 'Q2 2026', due: '2026-06-30', status: 'not_started' },
];

const MOCK_REVIEWS = [
  {
    id: 1, cycle: 'Q4 2025', reviewer: 'Jane Smith', rating: 4, date: '2026-01-15',
    strengths: 'Strong technical skills, great team player, delivers on time.',
    areas: 'Could improve on documentation and knowledge sharing.',
    status: 'acknowledged',
  },
];

const RATING_LABELS = { 1: 'Poor', 2: 'Below Average', 3: 'Meets Expectations', 4: 'Exceeds Expectations', 5: 'Outstanding' };
const STATUS_COLORS  = { completed: 'active', in_progress: 'pending', not_started: 'inactive', missed: 'inactive' };
const STATUS_LABELS  = { completed: 'Completed', in_progress: 'In Progress', not_started: 'Not Started', missed: 'Missed' };

export default function PerformancePage() {
  const [tab, setTab] = useState('goals');

  return (
    <>
      <TopBar title='Performance & KPIs' breadcrumb='Employee Hub / Performance' />
      <div className='page'>

        <div className='profile-tabs' style={{ marginBottom: '1.5rem' }}>
          {[['goals', 'My Goals'], ['reviews', 'Reviews']].map(([key, label]) => (
            <button key={key} className={`profile-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Goals ── */}
        {tab === 'goals' && (
          <div className='card'>
            <div className='card__header'>
              <span className='card__title'>Performance Goals</span>
            </div>
            <div className='table-wrap'>
              <table>
                <thead>
                  <tr><th>Goal</th><th>Cycle</th><th>Due Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {MOCK_GOALS.map(g => (
                    <tr key={g.id}>
                      <td style={{ fontWeight: 500 }}>{g.title}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{g.cycle}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{g.due}</td>
                      <td><span className={`badge badge--${STATUS_COLORS[g.status]}`}>{STATUS_LABELS[g.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        {tab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {MOCK_REVIEWS.length === 0 ? (
              <div className='empty-state'><i className='bi bi-graph-up-arrow'></i><p>No reviews yet.</p></div>
            ) : MOCK_REVIEWS.map(r => (
              <div className='card' key={r.id}>
                <div className='card__header'>
                  <div>
                    <span className='card__title'>{r.cycle} Review</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Reviewed by {r.reviewer} · {r.date}</p>
                  </div>
                  <span className='badge badge--active'>{r.status}</span>
                </div>
                <div className='card__body'>
                  {/* Rating stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <i key={s} className={`bi ${s <= r.rating ? 'bi-star-fill' : 'bi-star'}`}
                          style={{ color: s <= r.rating ? '#f59e0b' : 'var(--border)', fontSize: '1.1rem' }}></i>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-primary)' }}>{RATING_LABELS[r.rating]}</span>
                  </div>

                  <div className='form-grid'>
                    <div>
                      <p className='form-label' style={{ marginBottom: '0.4rem' }}>Strengths</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.strengths}</p>
                    </div>
                    <div>
                      <p className='form-label' style={{ marginBottom: '0.4rem' }}>Areas for Improvement</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.areas}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}

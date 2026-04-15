import { useEffect, useState, useCallback } from 'react';
import TopBar from '../components/TopBar';
import Spinner from '../components/Spinner';
import { getDashboardStats } from '../api/HrService';

const STAT_CARDS = [
  { key: 'employees',         icon: 'bi-people',         color: 'blue',  label: 'Total Employees' },
  { key: 'pendingLeave',      icon: 'bi-calendar-check', color: 'amber', label: 'Pending Leave' },
  { key: 'pendingTimesheets', icon: 'bi-clock-history',  color: 'amber', label: 'Pending Timesheets' },
  { key: 'pendingDocuments',  icon: 'bi-folder2-open',   color: 'red',   label: 'Pending Documents' },
];

export default function DashboardPage() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <TopBar title='Dashboard' breadcrumb='HR Admin / Dashboard' />
      <div className='page'>
        {loading ? <Spinner /> : (
          <div className='stat-grid'>
            {STAT_CARDS.map(({ key, icon, color, label }) => (
              <div className='stat-card' key={key}>
                <div className={`stat-card__icon stat-card__icon--${color}`}>
                  <i className={`bi ${icon}`}></i>
                </div>
                <div>
                  <div className='stat-card__value'>{stats?.[key] ?? '—'}</div>
                  <div className='stat-card__label'>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

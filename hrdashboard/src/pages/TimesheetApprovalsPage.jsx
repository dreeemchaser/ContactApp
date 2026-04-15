import { useEffect, useState, useCallback } from 'react';
import TopBar from '../components/TopBar';
import Spinner from '../components/Spinner';
import { getAllTimesheets, approveTimesheet } from '../api/HrService';

const STATUS_COLOR = { APPROVED: 'approved', REJECTED: 'rejected', SUBMITTED: 'submitted', DRAFT: 'pending' };

export default function TimesheetApprovalsPage() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [acting, setActing]         = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllTimesheets();
      setTimesheets(res.data?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    setActing(id);
    try {
      await approveTimesheet(id);
      setTimesheets(prev => prev.map(t => t.id === id ? { ...t, status: 'APPROVED' } : t));
    } finally {
      setActing(null);
    }
  };

  return (
    <>
      <TopBar title='Timesheet Approvals' breadcrumb='HR Admin / Timesheet Approvals' />
      <div className='page'>
        <div className='card'>
          <div className='card__header'>
            <span className='card__title'>Timesheets</span>
          </div>
          {loading ? <Spinner /> : (
            <div className='table-wrap'>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Week Starting</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No timesheets found.</td></tr>
                  ) : timesheets.map(t => (
                    <tr key={t.id}>
                      <td>{t.employee?.firstName} {t.employee?.lastName}</td>
                      <td>{t.weekStarting}</td>
                      <td>{t.totalHours ?? '—'}</td>
                      <td><span className={`badge badge--${STATUS_COLOR[t.status] ?? 'pending'}`}>{t.status}</span></td>
                      <td>
                        {t.status === 'SUBMITTED' && (
                          <button
                            className='btn btn-success btn-sm'
                            disabled={acting === t.id}
                            onClick={() => handleApprove(t.id)}
                          >
                            <i className='bi bi-check-lg'></i> Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

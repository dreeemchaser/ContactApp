import { useEffect, useState, useCallback } from 'react';
import TopBar from '../components/TopBar';
import Spinner from '../components/Spinner';
import { getAllLeaveRequests, approveLeave, rejectLeave } from '../api/HrService';

const STATUS_COLOR = { APPROVED: 'approved', REJECTED: 'rejected', PENDING: 'pending', CANCELLED: 'inactive' };

export default function LeaveApprovalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllLeaveRequests();
      setRequests(res.data?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handle = async (id, action) => {
    setActing(id);
    try {
      await action(id);
      setRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: action === approveLeave ? 'APPROVED' : 'REJECTED' } : r
      ));
    } finally {
      setActing(null);
    }
  };

  return (
    <>
      <TopBar title='Leave Approvals' breadcrumb='HR Admin / Leave Approvals' />
      <div className='page'>
        <div className='card'>
          <div className='card__header'>
            <span className='card__title'>Leave Requests</span>
          </div>
          {loading ? <Spinner /> : (
            <div className='table-wrap'>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No leave requests found.</td></tr>
                  ) : requests.map(r => (
                    <tr key={r.id}>
                      <td>{r.employee?.firstName} {r.employee?.lastName}</td>
                      <td>{r.leaveType?.name}</td>
                      <td>{r.startDate}</td>
                      <td>{r.endDate}</td>
                      <td>{r.totalDays}</td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: 200 }}>{r.reason}</td>
                      <td><span className={`badge badge--${STATUS_COLOR[r.status] ?? 'pending'}`}>{r.status}</span></td>
                      <td>
                        {r.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              className='btn btn-success btn-sm'
                              disabled={acting === r.id}
                              onClick={() => handle(r.id, approveLeave)}
                            >
                              <i className='bi bi-check-lg'></i> Approve
                            </button>
                            <button
                              className='btn btn-danger btn-sm'
                              disabled={acting === r.id}
                              onClick={() => handle(r.id, rejectLeave)}
                            >
                              <i className='bi bi-x-lg'></i> Reject
                            </button>
                          </div>
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

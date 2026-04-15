import { useEffect, useState, useCallback } from 'react';
import TopBar from '../components/TopBar';
import Spinner from '../components/Spinner';
import { getEmployees } from '../api/HrService';

const STATUS_COLOR = { ACTIVE: 'active', INACTIVE: 'inactive', ON_LEAVE: 'pending', TERMINATED: 'inactive' };

export default function EmployeesPage() {
  const [data, setData]       = useState({ content: [], totalPages: 0 });
  const [page, setPage]       = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const res = await getEmployees(p);
      setData(res.data?.data ?? res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const employees = data.content ?? [];
  const totalPages = data.totalPages ?? 0;

  return (
    <>
      <TopBar title='Employees' breadcrumb='HR Admin / Employees' />
      <div className='page'>
        <div className='card'>
          <div className='card__header'>
            <span className='card__title'>All Employees</span>
          </div>
          {loading ? <Spinner /> : (
            <div className='table-wrap'>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Team</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No employees found.</td></tr>
                  ) : employees.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.firstName} {emp.lastName}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{emp.jobTitle}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{emp.department?.name ?? emp.department ?? '—'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{emp.team?.name ?? emp.team ?? '—'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
                      <td>
                        <span className={`badge badge--${STATUS_COLOR[emp.employmentStatus] ?? 'pending'}`}>
                          {emp.employmentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div className='pagination'>
              <a className={page === 0 ? 'disabled' : ''} onClick={() => setPage(p => Math.max(0, p - 1))}>‹</a>
              {Array.from({ length: totalPages }, (_, i) => (
                <a key={i} className={i === page ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</a>
              ))}
              <a className={page === totalPages - 1 ? 'disabled' : ''} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>›</a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

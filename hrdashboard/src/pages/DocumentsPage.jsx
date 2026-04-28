import { useEffect, useState, useCallback } from 'react';
import TopBar from '../components/TopBar';
import Spinner from '../components/Spinner';
import { getAllDocuments, verifyDocument } from '../api/HrService';

const STATUS_COLOR = { VERIFIED: 'verified', PENDING: 'pending', REJECTED: 'rejected' };

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [acting, setActing]       = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllDocuments();
      setDocuments(res.data?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleVerify = async (id) => {
    setActing(id);
    try {
      await verifyDocument(id);
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'VERIFIED' } : d));
    } finally {
      setActing(null);
    }
  };

  return (
    <>
      <TopBar title='Documents' breadcrumb='HR Admin / Documents' />
      <div className='page'>
        <div className='card'>
          <div className='card__header'>
            <span className='card__title'>Employee Documents</span>
          </div>
          {loading ? <Spinner /> : (
            <div className='table-wrap'>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Document Type</th>
                    <th>File</th>
                    <th>Uploaded</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {documents.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No documents found.</td></tr>
                  ) : documents.map(d => (
                    <tr key={d.id}>
                      <td>{d.employee?.firstName} {d.employee?.lastName}</td>
                      <td>{d.documentType}</td>
                      <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{d.fileName}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : '—'}</td>
                      <td><span className={`badge badge--${STATUS_COLOR[d.status] ?? 'pending'}`}>{d.status}</span></td>
                      <td>
                        {d.status === 'PENDING' && (
                          <button
                            className='btn btn-success btn-sm'
                            disabled={acting === d.id}
                            onClick={() => handleVerify(d.id)}
                          >
                            <i className='bi bi-patch-check'></i> Verify
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

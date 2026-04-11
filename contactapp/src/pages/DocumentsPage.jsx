import { useState, useRef } from 'react';
import TopBar from '../components/TopBar';

const DOC_TYPES = ['ID Document', 'Contract', 'Certificate', 'Payslip', 'Other'];

const MOCK_DOCS = [
  { id: 1, name: 'Employment_Contract.pdf',  type: 'Contract',     size: '245 KB', uploaded: '2025-01-10', status: 'verified' },
  { id: 2, name: 'SA_ID_Copy.pdf',           type: 'ID Document',  size: '180 KB', uploaded: '2025-01-10', status: 'verified' },
  { id: 3, name: 'BCom_Certificate.pdf',     type: 'Certificate',  size: '320 KB', uploaded: '2025-03-05', status: 'pending' },
];

const TYPE_ICONS = {
  'ID Document': 'bi-person-vcard',
  'Contract':    'bi-file-earmark-text',
  'Certificate': 'bi-award',
  'Payslip':     'bi-receipt',
  'Other':       'bi-file-earmark',
};

export default function DocumentsPage() {
  const [tab, setTab]       = useState('documents');
  const [docType, setDocType] = useState('');
  const [file, setFile]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();

  const handleUpload = e => {
    e.preventDefault();
    if (!file || !docType) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setFile(null);
      setDocType('');
      if (fileRef.current) fileRef.current.value = '';
      setTimeout(() => { setSuccess(false); setTab('documents'); }, 1500);
    }, 1000);
  };

  return (
    <>
      <TopBar title='Documents' breadcrumb='Employee Hub / Documents' />
      <div className='page'>

        <div className='profile-tabs' style={{ marginBottom: '1.5rem' }}>
          {[['documents', 'My Documents'], ['upload', 'Upload Document']].map(([key, label]) => (
            <button key={key} className={`profile-tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── My Documents ── */}
        {tab === 'documents' && (
          <div className='card'>
            <div className='card__header'>
              <span className='card__title'>My Documents</span>
              <button className='btn btn-sm' onClick={() => setTab('upload')}><i className='bi bi-upload'></i> Upload</button>
            </div>
            <div className='table-wrap'>
              <table>
                <thead>
                  <tr><th>Document</th><th>Type</th><th>Size</th><th>Uploaded</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {MOCK_DOCS.map(doc => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <i className={`bi ${TYPE_ICONS[doc.type] || 'bi-file-earmark'}`} style={{ color: 'var(--brand)', fontSize: '1.1rem' }}></i>
                          <span style={{ fontWeight: 500 }}>{doc.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{doc.type}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{doc.size}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{doc.uploaded}</td>
                      <td><span className={`badge badge--${doc.status}`}>{doc.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Upload ── */}
        {tab === 'upload' && (
          <div className='card' style={{ maxWidth: 520 }}>
            <div className='card__header'>
              <span className='card__title'>Upload Document</span>
            </div>
            <div className='card__body'>
              {success && <p className='feedback feedback--success'><i className='bi bi-check-circle'></i> Document uploaded successfully.</p>}
              <form onSubmit={handleUpload}>
                <div className='form-group' style={{ marginBottom: '1rem' }}>
                  <label className='form-label'>Document Type</label>
                  <select className='form-control' value={docType} onChange={e => setDocType(e.target.value)} required>
                    <option value=''>— Select type —</option>
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className='form-group' style={{ marginBottom: '1.25rem' }}>
                  <label className='form-label'>File</label>
                  <div
                    className='doc-dropzone'
                    onClick={() => fileRef.current?.click()}
                  >
                    <i className='bi bi-cloud-upload'></i>
                    <p>{file ? file.name : 'Click to select a file'}</p>
                    <span>{file ? `${(file.size / 1024).toFixed(0)} KB` : 'PDF, JPG, PNG up to 10MB'}</span>
                    <input ref={fileRef} type='file' accept='.pdf,.jpg,.jpeg,.png' style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type='button' className='btn btn-ghost' onClick={() => { setFile(null); setDocType(''); }}>Clear</button>
                  <button type='submit' className='btn' disabled={uploading || !file || !docType}>
                    {uploading ? 'Uploading...' : <><i className='bi bi-upload'></i> Upload</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

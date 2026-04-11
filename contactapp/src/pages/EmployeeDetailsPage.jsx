import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContact, updateContact, updatePhoto, deleteContact } from '../api/ContactService';
import Spinner from '../components/Spinner';
import TopBar from '../components/TopBar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const FALLBACK = 'https://ui-avatars.com/api/?background=1a3a5c&color=fff&name=';

const EmployeeDetailsPage = ({ onContactUpdated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getContact(id).then(r => setContact(r.data)).catch(console.error);
  }, [id]);

  if (!contact) return <Spinner />;

  const photoSrc = preview
    ? preview
    : contact.photoURL
      ? `${API_URL}/contacts/image/${contact.photoURL}`
      : `${FALLBACK}${encodeURIComponent(contact.name)}`;

  const handleChange = e => setContact({ ...contact, [e.target.name]: e.target.value });

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      let updated = { ...contact };
      if (photo) {
        const fd = new FormData();
        fd.append('id', contact.id);
        fd.append('file', photo);
        const res = await updatePhoto(fd);
        updated = { ...updated, photoURL: res.data };
        setContact(updated);
        setPreview(null);
        setPhoto(null);
      }
      await updateContact(updated);
      setSuccess('Changes saved successfully.');
      onContactUpdated?.();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContact(id);
      onContactUpdated?.();
      navigate('/employees');
    } catch {
      setError('Failed to delete employee.');
      setConfirmDelete(false);
    }
  };

  const isActive = contact.status?.toLowerCase() === 'active';

  return (
    <>
      <TopBar title={contact.name} breadcrumb='Employee Hub / Employees / Details' />
      <div className='page'>
        <div className='profile-layout'>

          {/* Left panel */}
          <div className='profile-card'>
            <label className='profile-card__photo-wrap' htmlFor='photo-upload'>
              <img src={photoSrc} alt={contact.name} />
              <span className='photo-overlay'><i className='bi bi-camera'></i></span>
            </label>
            <input id='photo-upload' type='file' accept='image/*' onChange={handlePhotoChange} style={{ display: 'none' }} />

            <div>
              <p className='profile-card__name'>{contact.name}</p>
              {contact.title && <p className='profile-card__title'>{contact.title}</p>}
            </div>

            <span className={`badge badge--${isActive ? 'active' : 'inactive'}`}>
              <i className={`bi ${isActive ? 'bi-check-circle' : 'bi-x-circle'}`}></i>
              {contact.status}
            </span>

            <button onClick={() => navigate('/employees')} className='btn btn-ghost profile-card__back'>
              <i className='bi bi-arrow-left'></i> Back to Employees
            </button>
          </div>

          {/* Right panel */}
          <div className='profile-form-card'>
            {error   && <p className='feedback feedback--error'><i className='bi bi-exclamation-circle'></i> {error}</p>}
            {success && <p className='feedback feedback--success'><i className='bi bi-check-circle'></i> {success}</p>}

            <div className='form-grid'>
              {[
                { label: 'Name',    name: 'name',    type: 'text' },
                { label: 'Email',   name: 'email',   type: 'email' },
                { label: 'Phone',   name: 'phone',   type: 'text' },
                { label: 'Title',   name: 'title',   type: 'text' },
                { label: 'Address', name: 'address', type: 'text' },
              ].map(f => (
                <div className='form-group' key={f.name}>
                  <label className='form-label'>{f.label}</label>
                  <input className='form-control' type={f.type} name={f.name} value={contact[f.name] || ''} onChange={handleChange} />
                </div>
              ))}

              <div className='form-group'>
                <label className='form-label'>Status</label>
                <select className='form-control' name='status' value={contact.status || 'active'} onChange={handleChange}>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>
            </div>

            <div className='profile-form-actions'>
              <button onClick={() => setConfirmDelete(true)} className='btn btn-danger btn-sm'>
                <i className='bi bi-trash'></i> Delete
              </button>
              <button onClick={handleSave} className='btn btn-sm' disabled={saving}>
                {saving ? 'Saving...' : <><i className='bi bi-save'></i> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className='confirm-overlay'>
          <div className='confirm-box'>
            <div className='confirm-box__icon'><i className='bi bi-exclamation-triangle'></i></div>
            <h3>Delete Employee</h3>
            <p>Are you sure you want to delete <strong>{contact.name}</strong>? This cannot be undone.</p>
            <div className='confirm-box__actions'>
              <button onClick={() => setConfirmDelete(false)} className='btn btn-ghost'>Cancel</button>
              <button onClick={handleDelete} className='btn btn-danger'>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeDetailsPage;

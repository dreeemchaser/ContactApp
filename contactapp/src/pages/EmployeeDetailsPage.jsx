import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContact, updateContact, updatePhoto, deleteContact } from '../api/ContactService';
import Spinner from '../components/Spinner';
import TopBar from '../components/TopBar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const FALLBACK = 'https://ui-avatars.com/api/?background=1a3a5c&color=fff&name=';

const TABS = ['Personal', 'Contact', 'Employment'];

const Field = ({ label, name, type = 'text', value, onChange, options }) => (
  <div className='form-group'>
    <label className='form-label'>{label}</label>
    {options ? (
      <select className='form-control' name={name} value={value || ''} onChange={onChange}>
        <option value=''>— Select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input className='form-control' type={type} name={name} value={value || ''} onChange={onChange} />
    )}
  </div>
);

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
  const [activeTab, setActiveTab] = useState('Personal');

  useEffect(() => {
    getContact(id).then(r => setContact(r.data)).catch(console.error);
  }, [id]);

  if (!contact) return <Spinner />;

  const photoSrc = preview
    ? preview
    : contact.photoURL
      ? `${API_URL}/contacts/image/${contact.photoURL}`
      : `${FALLBACK}${encodeURIComponent(contact.name)}`;

  const set = e => setContact({ ...contact, [e.target.name]: e.target.value });

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
      <TopBar title={contact.name} breadcrumb='Employee Hub / Employees / Profile' />
      <div className='page'>
        <div className='profile-layout'>

          {/* ── Left Panel ── */}
          <div className='profile-card'>
            <label className='profile-card__photo-wrap' htmlFor='photo-upload'>
              <img src={photoSrc} alt={contact.name} />
              <span className='photo-overlay'><i className='bi bi-camera'></i></span>
            </label>
            <input id='photo-upload' type='file' accept='image/*' onChange={handlePhotoChange} style={{ display: 'none' }} />

            <div style={{ textAlign: 'center' }}>
              <p className='profile-card__name'>{contact.name}</p>
              {contact.title && <p className='profile-card__title'>{contact.title}</p>}
            </div>

            <span className={`badge badge--${isActive ? 'active' : 'inactive'}`}>
              <i className={`bi ${isActive ? 'bi-check-circle' : 'bi-x-circle'}`}></i>
              {contact.status || 'Unknown'}
            </span>

            {contact.employeeNumber && (
              <p style={{ fontSize: '0.75rem', color: 'hsla(0,0%,100%,0.5)', marginTop: '-0.5rem' }}>
                {contact.employeeNumber}
              </p>
            )}

            {/* Quick info */}
            <div className='profile-card__meta'>
              {contact.email && (
                <div className='profile-card__meta-item'>
                  <i className='bi bi-envelope'></i>
                  <span>{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className='profile-card__meta-item'>
                  <i className='bi bi-telephone'></i>
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.department && (
                <div className='profile-card__meta-item'>
                  <i className='bi bi-building'></i>
                  <span>{contact.department}</span>
                </div>
              )}
              {contact.startDate && (
                <div className='profile-card__meta-item'>
                  <i className='bi bi-calendar3'></i>
                  <span>Since {contact.startDate}</span>
                </div>
              )}
            </div>

            <button onClick={() => navigate('/employees')} className='btn btn-ghost profile-card__back'>
              <i className='bi bi-arrow-left'></i> Back to Employees
            </button>
          </div>

          {/* ── Right Panel ── */}
          <div className='profile-form-card'>
            {error   && <p className='feedback feedback--error'><i className='bi bi-exclamation-circle'></i> {error}</p>}
            {success && <p className='feedback feedback--success'><i className='bi bi-check-circle'></i> {success}</p>}

            {/* Tabs */}
            <div className='profile-tabs'>
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`profile-tab${activeTab === tab ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className='profile-tab-body'>

              {activeTab === 'Personal' && (
                <div className='form-grid'>
                  <Field label='First Name'    name='firstName'   value={contact.firstName}   onChange={set} />
                  <Field label='Last Name'     name='lastName'    value={contact.lastName}    onChange={set} />
                  <Field label='Date of Birth' name='dateOfBirth' value={contact.dateOfBirth} onChange={set} type='date' />
                  <Field label='Gender'        name='gender'      value={contact.gender}      onChange={set}
                    options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
                  <Field label='Nationality'   name='nationality' value={contact.nationality} onChange={set} />
                  <Field label='SA ID Number'  name='idNumber'    value={contact.idNumber}    onChange={set} />
                </div>
              )}

              {activeTab === 'Contact' && (
                <div className='form-grid'>
                  <Field label='Email'          name='email'   value={contact.email}   onChange={set} type='email' />
                  <Field label='Phone'          name='phone'   value={contact.phone}   onChange={set} />
                  <Field label='Address'        name='address' value={contact.address} onChange={set} />
                </div>
              )}

              {activeTab === 'Employment' && (
                <div className='form-grid'>
                  <Field label='Job Title'        name='title'          value={contact.title}          onChange={set} />
                  <Field label='Employee Number'  name='employeeNumber' value={contact.employeeNumber} onChange={set} />
                  <Field label='Department'       name='department'     value={contact.department}     onChange={set} />
                  <Field label='Team'             name='team'           value={contact.team}           onChange={set} />
                  <Field label='Employment Type'  name='employmentType' value={contact.employmentType} onChange={set}
                    options={['Full Time', 'Part Time']} />
                  <Field label='Start Date'       name='startDate'      value={contact.startDate}      onChange={set} type='date' />
                  <Field label='Status'           name='status'         value={contact.status}         onChange={set}
                    options={['active', 'inactive', 'suspended', 'terminated']} />
                </div>
              )}

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

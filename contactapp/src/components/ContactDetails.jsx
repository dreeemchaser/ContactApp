import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContact, updateContact, updatePhoto, deleteContact } from '../api/ContactService';
import Spinner from './Spinner';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const FALLBACK = `https://ui-avatars.com/api/?background=1a3a5c&color=fff&name=`;

const ContactDetails = ({ onContactUpdated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getContact(id).then(r => setContact(r.data)).catch(console.log);
  }, [id]);

  if (!contact) return <Spinner />;

  const photoSrc = preview
    ? preview
    : contact.photoURL
      ? `${API_URL}/contacts/image/${contact.photoURL}`
      : `${FALLBACK}${encodeURIComponent(contact.name)}`;

  const handleChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
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
      await updateContact(contact);
      if (photo) {
        const formData = new FormData();
        formData.append('id', contact.id);
        formData.append('file', photo);
        await updatePhoto(formData);
      }
      setSuccess('Contact saved successfully.');
      onContactUpdated?.();
    } catch (e) {
      setError('Failed to save contact. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${contact.name}? This cannot be undone.`)) return;
    try {
      await deleteContact(contact.id);
      onContactUpdated?.();
      navigate('/contacts');
    } catch (e) {
      setError('Failed to delete contact.');
    }
  };

  return (
    <div className='profile'>

      <div className='profile__details'>
        <label htmlFor='photo-upload' style={{ cursor: 'pointer', position: 'relative' }}>
          <img src={photoSrc} alt={contact.name} />
          <span className='photo-overlay'><i className='bi bi-camera'></i></span>
        </label>
        <input id='photo-upload' type='file' accept='image/*' onChange={handlePhotoChange} style={{ display: 'none' }} />
        <div className='profile__metadata'>
          <p className='profile__name'>{contact.name}</p>
          <p className='profile__muted'>{contact.title}</p>
          <button onClick={() => navigate('/contacts')} className='btn'>
            <i className='bi bi-arrow-left'></i> Back
          </button>
        </div>
      </div>

      <div className='profile__settings'>
        {error && <p className='feedback feedback--error'><i className='bi bi-exclamation-circle'></i> {error}</p>}
        {success && <p className='feedback feedback--success'><i className='bi bi-check-circle'></i> {success}</p>}

        <div className='user-details'>

          <div className='input-box'>
            <span className='details'>Name</span>
            <input type='text' name='name' value={contact.name || ''} onChange={handleChange} />
          </div>

          <div className='input-box'>
            <span className='details'>Email</span>
            <input type='email' name='email' value={contact.email || ''} onChange={handleChange} />
          </div>

          <div className='input-box'>
            <span className='details'>Phone</span>
            <input type='text' name='phone' value={contact.phone || ''} onChange={handleChange} />
          </div>

          <div className='input-box'>
            <span className='details'>Title</span>
            <input type='text' name='title' value={contact.title || ''} onChange={handleChange} />
          </div>

          <div className='input-box'>
            <span className='details'>Address</span>
            <input type='text' name='address' value={contact.address || ''} onChange={handleChange} />
          </div>

          <div className='input-box'>
            <span className='details'>Status</span>
            <select name='status' value={contact.status || 'active'} onChange={handleChange} className='input-select'>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>

        </div>

        <div className='profile__actions'>
          <button onClick={handleDelete} className='btn btn-danger'>
            <i className='bi bi-trash'></i> Delete
          </button>
          <button onClick={handleSave} className='btn' disabled={saving}>
            {saving ? 'Saving...' : <><i className='bi bi-save'></i> Save Changes</>}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ContactDetails;

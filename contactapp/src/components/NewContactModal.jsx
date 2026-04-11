import { useRef, useState } from 'react';
import { saveContact, updatePhoto } from '../api/ContactService';

const NewContactModal = ({ onContactSaved }) => {
  const dialogRef = useRef(null);
  const [contact, setContact] = useState({ name: '', email: '', phone: '', title: '', address: '', status: 'active' });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const open = () => { setError(null); dialogRef.current?.showModal(); };
  const close = () => {
    setContact({ name: '', email: '', phone: '', title: '', address: '', status: 'active' });
    setPhoto(null);
    setPreview(null);
    setError(null);
    dialogRef.current?.close();
  };

  const handleChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await saveContact(contact);
      if (photo) {
        const formData = new FormData();
        formData.append('id', response.data.id);
        formData.append('file', photo);
        await updatePhoto(formData);
      }
      await onContactSaved();
      close();
    } catch (err) {
      setError('Failed to save contact. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button onClick={open} className='btn'>
        <i className='bi bi-plus-square'></i> Add New Contact
      </button>

      <dialog ref={dialogRef} className='modal'>
        <div className='modal__header'>
          <h3>New Contact</h3>
          <i onClick={close} className='bi bi-x-lg'></i>
        </div>

        <div className='divider'></div>

        <div className='modal__body'>
          {error && <p className='feedback feedback--error'><i className='bi bi-exclamation-circle'></i> {error}</p>}
          <form onSubmit={handleSubmit}>
            <div className='user-details'>

              <div className='input-box'>
                <span className='details'>Name</span>
                <input type='text' name='name' value={contact.name} onChange={handleChange} required />
              </div>

              <div className='input-box'>
                <span className='details'>Email</span>
                <input type='email' name='email' value={contact.email} onChange={handleChange} required />
              </div>

              <div className='input-box'>
                <span className='details'>Phone</span>
                <input type='text' name='phone' value={contact.phone} onChange={handleChange} />
              </div>

              <div className='input-box'>
                <span className='details'>Title</span>
                <input type='text' name='title' value={contact.title} onChange={handleChange} />
              </div>

              <div className='input-box'>
                <span className='details'>Address</span>
                <input type='text' name='address' value={contact.address} onChange={handleChange} />
              </div>

              <div className='input-box'>
                <span className='details'>Status</span>
                <select name='status' value={contact.status} onChange={handleChange} className='input-select'>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>

              <div className='input-box'>
                <span className='details'>Photo</span>
                <input type='file' name='photo' accept='image/*' onChange={handlePhotoChange} />
              </div>

              {preview && (
                <div className='input-box' style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={preview} alt='preview' style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--selective-blue)' }} />
                </div>
              )}

            </div>

            <div className='divider'></div>

            <div className='modal__footer'>
              <button type='button' onClick={close} className='btn btn-danger'>Cancel</button>
              <button type='submit' className='btn' disabled={saving}>
                {saving ? 'Saving...' : 'Save Contact'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default NewContactModal;

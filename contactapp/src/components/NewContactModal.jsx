import { useRef, useState } from 'react';
import { saveContact, updatePhoto } from '../api/ContactService';

const EMPTY = { name: '', email: '', phone: '', title: '', address: '', status: 'active' };

const NewContactModal = ({ onContactSaved }) => {
  const dialogRef = useRef(null);
  const [contact, setContact] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const open  = () => { setError(null); dialogRef.current?.showModal(); };
  const close = () => {
    setContact(EMPTY);
    setPhoto(null);
    setPreview(null);
    setError(null);
    dialogRef.current?.close();
  };

  const handleChange = e => setContact({ ...contact, [e.target.name]: e.target.value });

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await saveContact(contact);
      if (photo) {
        const fd = new FormData();
        fd.append('id', res.data.id);
        fd.append('file', photo);
        await updatePhoto(fd);
      }
      await onContactSaved();
      close();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button onClick={open} className='btn btn-sm'>
        <i className='bi bi-plus-lg'></i> Add Employee
      </button>

      <dialog ref={dialogRef} className='modal'>
        <div className='modal__header'>
          <h3>New Employee</h3>
          <i onClick={close} className='bi bi-x-lg'></i>
        </div>

        <div className='divider'></div>

        {error && <p className='feedback feedback--error'><i className='bi bi-exclamation-circle'></i> {error}</p>}

        <form onSubmit={handleSubmit}>
          <div className='form-grid'>
            {[
              { label: 'Name',    name: 'name',    type: 'text',  required: true },
              { label: 'Email',   name: 'email',   type: 'email', required: true },
              { label: 'Phone',   name: 'phone',   type: 'text' },
              { label: 'Title',   name: 'title',   type: 'text' },
              { label: 'Address', name: 'address', type: 'text' },
            ].map(f => (
              <div className='form-group' key={f.name}>
                <label className='form-label'>{f.label}</label>
                <input className='form-control' type={f.type} name={f.name} value={contact[f.name]} onChange={handleChange} required={f.required} />
              </div>
            ))}

            <div className='form-group'>
              <label className='form-label'>Status</label>
              <select className='form-control' name='status' value={contact.status} onChange={handleChange}>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>

            <div className='form-group'>
              <label className='form-label'>Photo</label>
              <input className='form-control' type='file' accept='image/*' onChange={handlePhotoChange} />
            </div>

            {preview && (
              <div className='form-group' style={{ justifyContent: 'center' }}>
                <img src={preview} alt='preview' style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--brand)' }} />
              </div>
            )}
          </div>

          <div className='modal__footer'>
            <button type='button' onClick={close} className='btn btn-ghost'>Cancel</button>
            <button type='submit' className='btn' disabled={saving}>
              {saving ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default NewContactModal;

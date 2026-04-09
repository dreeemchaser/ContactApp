import { useRef, useState } from 'react';
import { saveContact } from '../api/ContactService';

const NewContactModal = ({ onContactSaved }) => {
  const dialogRef = useRef(null);
  const [contact, setContact] = useState({
    name: '', email: '', phone: '', title: '', address: '', status: 'active'
  });

  const open = () => dialogRef.current?.showModal();
  const close = () => {
    setContact({ name: '', email: '', phone: '', title: '', address: '', status: 'active' });
    dialogRef.current?.close();
  };

  const handleChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveContact(contact);
      onContactSaved();
      close();
    } catch (error) {
      console.log(error);
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
                <input type='text' name='status' value={contact.status} onChange={handleChange} />
              </div>

            </div>

            <div className='divider'></div>

            <div className='modal__footer'>
              <button type='button' onClick={close} className='btn btn-danger'>Cancel</button>
              <button type='submit' className='btn'>Save Contact</button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default NewContactModal;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContact } from '../api/ContactService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await getContact(id);
        setContact(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContact();
  }, [id]);

  if (!contact) return <p>Loading...</p>;

  const photoSrc = contact.photoURL ? `${API_URL}/contacts/image/${contact.photoURL}` : null;

  return (
    <div className='profile'>

      <div className='profile__details'>
        <img src={photoSrc} alt={contact.name} />
        <div className='profile__metadata'>
          <p className='profile__name'>{contact.name}</p>
          <p className='profile__muted'>{contact.title}</p>
          <button onClick={() => navigate('/contacts')} className='btn'>
            <i className='bi bi-arrow-left'></i> Back
          </button>
        </div>
      </div>

      <div className='profile__settings'>
        <div className='user-details'>

          <div className='input-box'>
            <span className='details'>Name</span>
            <input type='text' value={contact.name || ''} readOnly />
          </div>

          <div className='input-box'>
            <span className='details'>Email</span>
            <input type='text' value={contact.email || ''} readOnly />
          </div>

          <div className='input-box'>
            <span className='details'>Phone</span>
            <input type='text' value={contact.phone || ''} readOnly />
          </div>

          <div className='input-box'>
            <span className='details'>Title</span>
            <input type='text' value={contact.title || ''} readOnly />
          </div>

          <div className='input-box'>
            <span className='details'>Address</span>
            <input type='text' value={contact.address || ''} readOnly />
          </div>

          <div className='input-box'>
            <span className='details'>Status</span>
            <input type='text' value={contact.status || ''} readOnly />
          </div>

        </div>
      </div>

    </div>
  );
};

export default ContactDetails;

import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const FALLBACK = `https://ui-avatars.com/api/?background=1a3a5c&color=fff&name=`;

const Contact = ({ contact }) => {
  const photoSrc = contact.photoURL
    ? `${API_URL}/contacts/image/${contact.photoURL}`
    : `${FALLBACK}${encodeURIComponent(contact.name)}`;

  const isActive = contact.status?.toLowerCase() === 'active';

  return (
    <Link to={`/contacts/${contact.id}`} className='contact__item'>
      <div className='contact__header'>
        <div className='contact__image'>
          <img src={photoSrc} alt={contact.name} />
        </div>
        <div className='contact__details'>
          <p className='contact_name'>{contact.name?.substring(0, 15)}</p>
          <p className='contact_title'>{contact.title}</p>
        </div>
      </div>
      <div className='contact__body'>
        <p><i className='bi bi-envelope'></i>{contact.email?.substring(0, 20)}</p>
        <p><i className='bi bi-geo'></i>{contact.address}</p>
        <p><i className='bi bi-telephone'></i>{contact.phone}</p>
        <p>
          <span className={`status-badge ${isActive ? 'status-badge--active' : 'status-badge--inactive'}`}>
            <i className={`bi ${isActive ? 'bi-check-circle' : 'bi-x-circle'}`}></i>
            {contact.status}
          </span>
        </p>
      </div>
    </Link>
  );
};

export default Contact;

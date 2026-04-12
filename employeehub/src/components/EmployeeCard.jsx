import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const FALLBACK = 'https://ui-avatars.com/api/?background=1a3a5c&color=fff&name=';

const EmployeeCard = ({ contact }) => {
  const photoSrc = contact.photoURL
    ? `${API_URL}/employees/photo/${contact.photoURL}`
    : `${FALLBACK}${encodeURIComponent(contact.name)}`;

  const isActive = contact.status?.toLowerCase() === 'active';

  return (
    <Link to={`/employees/${contact.id}`} className='contact__item'>
      <div className='contact__header'>
        <img src={photoSrc} alt={contact.name} className='avatar avatar--md' />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {contact.name}
          </p>
          {contact.title && (
            <span style={{ fontSize: '0.72rem', color: 'var(--brand)', background: 'var(--brand-light)', borderRadius: 'var(--radius-full)', padding: '1px 8px', display: 'inline-block', marginTop: 2, fontWeight: 500 }}>
              {contact.title}
            </span>
          )}
        </div>
      </div>
      <div className='contact__body'>
        <p><i className='bi bi-envelope'></i>{contact.email?.substring(0, 24)}</p>
        <p><i className='bi bi-telephone'></i>{contact.phone}</p>
        <p><i className='bi bi-geo'></i>{contact.address}</p>
        <p>
          <span className={`badge badge--${isActive ? 'active' : 'inactive'}`}>
            <i className={`bi ${isActive ? 'bi-check-circle' : 'bi-x-circle'}`}></i>
            {contact.status}
          </span>
        </p>
      </div>
    </Link>
  );
};

export default EmployeeCard;

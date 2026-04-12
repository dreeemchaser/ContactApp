const Header = ({ nOfContacts, children }) => {
  return (
    <header className='header'>
      <div className='container'>
        <div className='header__brand'>
          <i className='bi bi-person-lines-fill'></i>
          <div>
            <h1 className='header__title'>Contacts</h1>
            <p className='header__subtitle'>{nOfContacts ?? '—'} {nOfContacts === 1 ? 'contact' : 'contacts'}</p>
          </div>
        </div>
        <div className='header__actions'>
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;

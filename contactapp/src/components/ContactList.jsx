import Contact from './Contact';
import Spinner from './Spinner';

const ContactList = ({ data, currentPage, getAllContacts, loading }) => {
  if (loading) return <Spinner />;

  return (
    <main className='main'>

      {data?.content?.length === 0 && (
        <div className='empty-state'>
          <i className='bi bi-person-x'></i>
          <p>No contacts yet. Add your first contact to get started.</p>
        </div>
      )}

      <ul className='contact__list'>
        {data?.content?.length > 0 && data.content.map(contact =>
          <Contact contact={contact} key={contact.id} />
        )}
      </ul>

      {data?.content?.length > 0 && data?.page?.totalPages > 1 && (
        <div className='pagination'>
          <a onClick={() => getAllContacts(currentPage - 1)} className={0 === currentPage ? 'disabled' : ''}>&laquo;</a>

          {[...Array(data.page.totalPages).keys()].map(page =>
            <a onClick={() => getAllContacts(page)} className={currentPage === page ? 'active' : ''} key={page}>{page + 1}</a>
          )}

          <a onClick={() => getAllContacts(currentPage + 1)} className={data.page.totalPages === currentPage + 1 ? 'disabled' : ''}>&raquo;</a>
        </div>
      )}

    </main>
  );
};

export default ContactList;

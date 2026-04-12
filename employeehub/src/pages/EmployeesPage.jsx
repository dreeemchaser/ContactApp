import EmployeeCard from '../components/EmployeeCard';
import Spinner from '../components/Spinner';
import TopBar from '../components/TopBar';
import NewContactModal from '../components/NewContactModal';

const EmployeesPage = ({ data, currentPage, getAllContacts, loading }) => (
  <>
    <TopBar title='Employees' breadcrumb='Employee Hub / Employees'>
      <NewContactModal onContactSaved={getAllContacts} />
    </TopBar>

    <div className='page'>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {data?.content?.length === 0 && (
            <div className='empty-state'>
              <i className='bi bi-people'></i>
              <p>No employees yet. Add your first employee to get started.</p>
            </div>
          )}

          <div className='contact__list'>
            {data?.content?.map(contact => (
              <EmployeeCard contact={contact} key={contact.id} />
            ))}
          </div>

          {data?.content?.length > 0 && data?.page?.totalPages > 1 && (
            <div className='pagination'>
              <button onClick={() => getAllContacts(currentPage - 1)} disabled={currentPage === 0}>&laquo;</button>
              {[...Array(data.page.totalPages).keys()].map(p => (
                <button onClick={() => getAllContacts(p)} className={currentPage === p ? 'active' : ''} key={p}>{p + 1}</button>
              ))}
              <button onClick={() => getAllContacts(currentPage + 1)} disabled={data.page.totalPages === currentPage + 1}>&raquo;</button>
            </div>
          )}
        </>
      )}
    </div>
  </>
);

export default EmployeesPage;

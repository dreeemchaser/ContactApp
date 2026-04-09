import './App.css';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import { getContacts } from './api/ContactService';

function App() {

  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const getAllContacts = async (page = 0, size = 10) => {
    try{

      setCurrentPage(page);

      // Call to the backend.
      const response = await getContacts(page, size);

      // Set Data & Log it for testing.
      setData(response.data);
      console.log(response.data);


    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <div>
      <Header></Header>
                <div>
          <p>Total Contacts: {data.page?.totalElements || 0}</p>
          {data.content && data.content.length > 0 ? (
            <ul>
              {data.content.map((contact) => (
                <li key={contact.id}>
                  {contact.name} - {contact.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No contacts found.</p>
          )}
        </div>
    </div>
  );
}

export default App;
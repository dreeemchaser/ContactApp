import './App.css';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import { getContacts } from './api/ContactService';

function App() {

  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const getAllContacts = async (page = 9, size = 10) => {
    try{

      setCurrentPage(page);

      // Call to the backend.
      const data = await getContacts(page, size);

      // Set Data & Log it for testing. 
      setData(data);
      console.log(data);


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
        <h1> Contact List </h1>
    </div>
  );
}

export default App;
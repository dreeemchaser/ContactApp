import "./App.css";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import { useEffect, useState } from "react";
import { getContacts } from "./api/ContactService";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);

      // Call to the backend.
      const response = await getContacts(page, size);

      // Set Data & Log it for testing.
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  const toggleModal = () => {
    console.log(
      "I was clicked. This functionality will be implemented in the future.",
    );
  };

  return (
    <>
      <Header toggleModal={toggleModal} nOfContacts={data.page?.totalElements} />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts}/> }/>
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;

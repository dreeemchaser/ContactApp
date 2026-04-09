import "./App.css";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import ContactDetails from "./components/ContactDetails";
import NewContactModal from "./components/NewContactModal";
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

  return (
    <>
      <Header nOfContacts={data.page?.totalElements}>
        <NewContactModal onContactSaved={getAllContacts} />
      </Header>
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts}/> }/>
            <Route path="/contacts/:id" element={<ContactDetails />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;

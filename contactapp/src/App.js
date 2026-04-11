import "./App.css";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import ContactDetails from "./components/ContactDetails";
import NewContactModal from "./components/NewContactModal";
import LoginPage from "./components/LoginPage";
import { useEffect, useState } from "react";
import { getContacts } from "./api/ContactService";
import { isLoggedIn, logout } from "./api/AuthService";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      setCurrentPage(page);
      const response = await getContacts(page, size);
      setData(response.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        setLoggedIn(false);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) getAllContacts();
  }, [loggedIn]);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <>
      <Header nOfContacts={data.page?.totalElements}>
        <NewContactModal onContactSaved={getAllContacts} />
        <button onClick={() => { logout(); setLoggedIn(false); }} className="btn btn-danger" style={{ marginLeft: '0.5rem' }}>
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </Header>
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts} loading={loading} />} />
            <Route path="/contacts/:id" element={<ContactDetails onContactUpdated={getAllContacts} />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;

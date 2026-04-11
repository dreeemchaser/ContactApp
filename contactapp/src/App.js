import './index.css';
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './api/AuthService';
import { getContacts } from './api/ContactService';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import { LeavePage, TimesheetsPage, DocumentsPage, PerformancePage, SalaryPage, BenefitsPage } from './pages/ModuleShells';

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      setCurrentPage(page);
      const res = await getContacts(page, size);
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) getAllContacts();
  }, [loggedIn]);

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  return (
    <div className='app-shell'>
      <Sidebar onLogout={() => setLoggedIn(false)} />
      <div className='main-content'>
        <Routes>
          <Route path='/' element={<Navigate to='/dashboard' />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/employees' element={<EmployeesPage data={data} currentPage={currentPage} getAllContacts={getAllContacts} loading={loading} />} />
          <Route path='/employees/:id' element={<EmployeeDetailsPage onContactUpdated={getAllContacts} />} />
          <Route path='/leave' element={<LeavePage />} />
          <Route path='/timesheets' element={<TimesheetsPage />} />
          <Route path='/documents' element={<DocumentsPage />} />
          <Route path='/performance' element={<PerformancePage />} />
          <Route path='/salary' element={<SalaryPage />} />
          <Route path='/benefits' element={<BenefitsPage />} />
          <Route path='*' element={<Navigate to='/dashboard' />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

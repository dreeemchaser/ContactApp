import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../api/AuthService';

const NAV = [
  { section: 'Main', links: [
    { to: '/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
    { to: '/employees', icon: 'bi-people', label: 'Employees' },
  ]},
  { section: 'Self Service', links: [
    { to: '/leave', icon: 'bi-calendar-check', label: 'Leave' },
    { to: '/timesheets', icon: 'bi-clock-history', label: 'Timesheets' },
    { to: '/documents', icon: 'bi-folder2-open', label: 'Documents' },
    { to: '/performance', icon: 'bi-graph-up-arrow', label: 'Performance' },
    { to: '/salary', icon: 'bi-cash-coin', label: 'Salary' },
    { to: '/benefits', icon: 'bi-shield-check', label: 'Benefits' },
  ]},
];

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <aside className='sidebar'>
      <div className='sidebar__logo'>
        <div className='sidebar__logo-icon'>
          <i className='bi bi-building'></i>
        </div>
        <div>
          <div className='sidebar__logo-text'>Employee Hub</div>
          <div className='sidebar__logo-sub'>HR Portal</div>
        </div>
      </div>

      <nav className='sidebar__nav'>
        {NAV.map(({ section, links }) => (
          <div key={section}>
            <div className='sidebar__section-label'>{section}</div>
            {links.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
              >
                <i className={`bi ${icon}`}></i>
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className='sidebar__footer'>
        <button className='sidebar__logout' onClick={handleLogout}>
          <i className='bi bi-box-arrow-left'></i> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

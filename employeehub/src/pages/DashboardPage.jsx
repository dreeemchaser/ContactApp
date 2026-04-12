import TopBar from '../components/TopBar';

const stats = [
  { icon: 'bi-people', color: 'blue',  value: '—', label: 'Total Employees' },
  { icon: 'bi-calendar-check', color: 'green', value: '—', label: 'Leave Requests' },
  { icon: 'bi-clock-history', color: 'amber', value: '—', label: 'Pending Timesheets' },
  { icon: 'bi-folder2-open', color: 'red', value: '—', label: 'Documents Pending' },
];

const DashboardPage = () => (
  <>
    <TopBar title='Dashboard' breadcrumb='Employee Hub / Dashboard' />
    <div className='page'>
      <div className='stat-grid'>
        {stats.map(s => (
          <div className='stat-card' key={s.label}>
            <div className={`stat-card__icon stat-card__icon--${s.color}`}>
              <i className={`bi ${s.icon}`}></i>
            </div>
            <div>
              <div className='stat-card__value'>{s.value}</div>
              <div className='stat-card__label'>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className='card'>
        <div className='card__header'>
          <span className='card__title'>Recent Activity</span>
        </div>
        <div className='card__body'>
          <div className='empty-state'>
            <i className='bi bi-activity'></i>
            <p>Activity feed will appear here once data is connected.</p>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default DashboardPage;

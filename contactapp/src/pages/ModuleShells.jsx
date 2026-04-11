import TopBar from '../components/TopBar';

const ComingSoon = ({ title, breadcrumb, icon, description }) => (
  <>
    <TopBar title={title} breadcrumb={breadcrumb} />
    <div className='page'>
      <div className='coming-soon'>
        <i className={`bi ${icon}`}></i>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  </>
);

export const PerformancePage = () => (
  <ComingSoon
    title='Performance & KPIs'
    breadcrumb='Employee Hub / Performance'
    icon='bi-graph-up-arrow'
    description='View your goals, performance reviews, and feedback. Coming soon.'
  />
);

export const SalaryPage = () => (
  <ComingSoon
    title='Salary'
    breadcrumb='Employee Hub / Salary'
    icon='bi-cash-coin'
    description='View your payslips, salary history, and tax breakdown. Coming soon.'
  />
);

export const BenefitsPage = () => (
  <ComingSoon
    title='Benefits'
    breadcrumb='Employee Hub / Benefits'
    icon='bi-shield-check'
    description='View and apply for company benefits. Coming soon.'
  />
);

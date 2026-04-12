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

export default ComingSoon;

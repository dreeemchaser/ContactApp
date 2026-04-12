const TopBar = ({ title, breadcrumb, children }) => (
  <div className='topbar'>
    <div className='topbar__left'>
      <span className='topbar__title'>{title}</span>
      {breadcrumb && <span className='topbar__breadcrumb'>{breadcrumb}</span>}
    </div>
    <div className='topbar__right'>{children}</div>
  </div>
);

export default TopBar;

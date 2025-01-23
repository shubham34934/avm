import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.css';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const handleMenuClick = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // Get the page title based on the current route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Home';
      case '/campaign':
        return 'My Campaigns';
      case '/videos':
        return 'Videos';
      case '/ai-tools':
        return 'AI Tools';
      case '/reports':
        return 'Reports';
      default:
        return '';
    }
  };

  // Check if the current page should show header actions
  const shouldShowHeaderActions = () => {
    const path = location.pathname;
    return path === '/campaign' || path === '/videos';
  };

  return (
    <div className={styles.layout}>
      <Header 
        title={getPageTitle()}
        showHamburger={true}
        showSearch={shouldShowHeaderActions()}
        showAdd={shouldShowHeaderActions()}
        showMore={shouldShowHeaderActions()}
        onMenuClick={handleMenuClick}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <main className={`${styles.main} ${isSidebarOpen ? styles.shifted : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

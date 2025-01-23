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

  return (
    <div className={styles.layout}>
      <Header 
        title={getPageTitle()}
        showSearch={location.pathname === '/campaign'}
        showAdd={location.pathname === '/campaign'}
        showMore={location.pathname === '/campaign'}
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

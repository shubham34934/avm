import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import { useLayout } from '../../context/LayoutContext';

const Layout = () => {
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useLayout();
  const isVideoPlayer = location.pathname === '/video-player';

  return (
    <div className={styles.layout}>
      {!isVideoPlayer && (
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <Footer />
        </>
      )}
      
      <main className={`${styles.main} ${isVideoPlayer ? styles.fullscreen : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

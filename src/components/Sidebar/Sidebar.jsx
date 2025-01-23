import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { SIDEBAR_ITEMS } from '../../constants/navigation';
import styles from './Sidebar.module.css';
import PropTypes from 'prop-types';
import LogoutIcon from '../../assets/icons/logout.svg';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const filteredNavItems = SIDEBAR_ITEMS.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`} 
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user?.name}</h2>
            <span className={styles.userRole}>{user?.role}</span>
          </div>
          <button className={styles.editButton} aria-label="Edit profile">
            ✏️
          </button>
        </div>

        <nav className={styles.nav}>
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path ? styles.active : ''
              }`}
              onClick={() => handleNavigation(item.path)}
              aria-label={item.label}
            >
              <img 
                src={item.icon} 
                alt=""
                className={styles.icon}
                aria-hidden="true"
              />
              <span className={styles.label}>{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          className={styles.logoutButton}
          onClick={() => {
            // Handle logout
            navigate('/login');
          }}
        >
          <img src={LogoutIcon} alt="" className={styles.icon} />
          <span className={styles.label}>Logout</span>
        </button>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;

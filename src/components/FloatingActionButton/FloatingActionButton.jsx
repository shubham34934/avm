import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FloatingActionButton.module.css';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAddCampaign = () => {
    navigate('/campaign/create');
    setIsOpen(false);
  };

  const handleAddVideo = () => {
    // Handle add video
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      {isOpen && (
        <div className={styles.menu}>
          <button onClick={handleAddCampaign} className={styles.menuItem}>
            <div className={styles.menuIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Add Campaign</span>
          </button>
          <button onClick={handleAddVideo} className={styles.menuItem}>
            <div className={styles.menuIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 10L19.553 7.724C19.7054 7.64784 19.8748 7.61188 20.0466 7.61952C20.2184 7.62716 20.3838 7.67814 20.5276 7.76773C20.6714 7.85732 20.7883 7.98235 20.8676 8.13161C20.9469 8.28087 20.9862 8.44908 20.982 8.619V15.381C20.9862 15.5509 20.9469 15.7191 20.8676 15.8684C20.7883 16.0177 20.6714 16.1427 20.5276 16.2323C20.3838 16.3219 20.2184 16.3728 20.0466 16.3805C19.8748 16.3881 19.7054 16.3522 19.553 16.276L15 14M4 5H13C14.1046 5 15 5.89543 15 7V17C15 18.1046 14.1046 19 13 19H4C2.89543 19 2 18.1046 2 17V7C2 5.89543 2.89543 5 4 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Add Generic Video</span>
          </button>
        </div>
      )}
      <button 
        onClick={handleToggle} 
        className={`${styles.fab} ${isOpen ? styles.open : ''}`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default FloatingActionButton;

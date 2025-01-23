import PropTypes from 'prop-types';
import styles from './Header.module.css';

const Header = ({ 
  title, 
  showHamburger = false,
  showSearch = false, 
  showAdd = false, 
  showMore = false, 
  onMenuClick,
  onSearch, 
  onAdd, 
  onMore 
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {showHamburger && (
          <button 
            className={styles.actionButton} 
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.actions}>
        {showSearch && (
          <button 
            className={styles.actionButton} 
            onClick={onSearch}
            aria-label="Search"
          >
            <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5422 20.5751L13.2615 14.2943C12.7615 14.7071 12.1865 15.0302 11.5365 15.2635C10.8865 15.4968 10.214 15.6135 9.51916 15.6135C7.80999 15.6135 6.36348 15.0217 5.17961 13.8382C3.99574 12.6546 3.40381 11.2085 3.40381 9.49974C3.40381 7.791 3.99559 6.34433 5.17916 5.15971C6.36273 3.97511 7.80888 3.38281 9.51761 3.38281C11.2263 3.38281 12.673 3.97475 13.8576 5.15861C15.0422 6.34248 15.6345 7.789 15.6345 9.49816C15.6345 10.2123 15.5147 10.8943 15.2749 11.5443C15.0352 12.1943 14.7153 12.7597 14.3153 13.2405L20.5961 19.5212L19.5422 20.5751ZM9.51916 14.1136C10.8076 14.1136 11.899 13.6664 12.7932 12.7722C13.6874 11.878 14.1346 10.7866 14.1346 9.49816C14.1346 8.2097 13.6874 7.11835 12.7932 6.22411C11.899 5.32988 10.8076 4.88276 9.51916 4.88276C8.23069 4.88276 7.13934 5.32988 6.24511 6.22411C5.35089 7.11835 4.90378 8.2097 4.90378 9.49816C4.90378 10.7866 5.35089 11.878 6.24511 12.7722C7.13934 13.6664 8.23069 14.1136 9.51916 14.1136Z" fill="currentColor"/>
            </svg>
          </button>
        )}
        {showAdd && (
          <button 
            className={styles.actionButton} 
            onClick={onAdd}
            aria-label="Add new"
          >
            <svg className={styles.actionIcon} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.8 17.2H9.2C8.86 17.2 8.575 17.0857 8.345 16.857C8.115 16.6283 8 16.345 8 16.007C8 15.669 8.115 15.3833 8.345 15.15C8.575 14.9167 8.86 14.8 9.2 14.8H14.8V9.2C14.8 8.86 14.9143 8.575 15.143 8.345C15.3717 8.115 15.655 8 15.993 8C16.331 8 16.6167 8.115 16.85 8.345C17.0833 8.575 17.2 8.86 17.2 9.2V14.8H22.8C23.14 14.8 23.425 14.9143 23.655 15.143C23.885 15.3717 24 15.655 24 15.993C24 16.331 23.885 16.6167 23.655 16.85C23.425 17.0833 23.14 17.2 22.8 17.2H17.2V22.8C17.2 23.14 17.0857 23.425 16.857 23.655C16.6283 23.885 16.345 24 16.007 24C15.669 24 15.3833 23.885 15.15 23.655C14.9167 23.425 14.8 23.14 14.8 22.8V17.2Z" fill="currentColor"/>
            </svg>
          </button>
        )}
        {showMore && (
          <button 
            className={styles.actionButton} 
            onClick={onMore}
            aria-label="More options"
          >
            <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM10 18C10 16.9 10.9 16 12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18Z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  showHamburger: PropTypes.bool,
  showSearch: PropTypes.bool,
  showAdd: PropTypes.bool,
  showMore: PropTypes.bool,
  onMenuClick: PropTypes.func,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  onMore: PropTypes.func,
};

export default Header;

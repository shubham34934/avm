import PropTypes from 'prop-types';
import styles from './Header.module.css';
import SearchIcon from '../../assets/icons/search.svg';
import AddIcon from '../../assets/icons/add.svg';
import MoreIcon from '../../assets/icons/more.svg';

const Header = ({ title, showSearch = false, showAdd = false, showMore = false, onSearch, onAdd, onMore }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        {showSearch && (
          <button 
            className={styles.actionButton} 
            onClick={onSearch}
            aria-label="Search"
          >
            <img src={SearchIcon} alt="" className={styles.actionIcon} aria-hidden="true" />
          </button>
        )}
        {showAdd && (
          <button 
            className={styles.actionButton} 
            onClick={onAdd}
            aria-label="Add new"
          >
            <img src={AddIcon} alt="" className={styles.actionIcon} aria-hidden="true" />
          </button>
        )}
        {showMore && (
          <button 
            className={styles.actionButton} 
            onClick={onMore}
            aria-label="More options"
          >
            <img src={MoreIcon} alt="" className={styles.actionIcon} aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  showSearch: PropTypes.bool,
  showAdd: PropTypes.bool,
  showMore: PropTypes.bool,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  onMore: PropTypes.func,
};

export default Header;

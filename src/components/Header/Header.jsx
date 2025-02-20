import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./Header.module.css";
import menuIcon from "../../assets/icons/menu.svg";
import searchIcon from "../../assets/icons/search.svg";
import addIcon from "../../assets/icons/add.svg";
import moreIcon from "../../assets/icons/more.svg";
import backIcon from "../../assets/icons/back.svg";
import { HEADER_CONFIG } from "../../constants/headerConfig";
import { useLayout } from "../../context/LayoutContext";

const Header = ({
  onMenu,
  onSearch,
  onAdd,
  onMore,
  showBack,
  showMenu,
  title,
  showSearch,
  showAdd,
  showMore,
}) => {
  const location = useLocation();
  const { toggleSidebar } = useLayout();
  const navigate = useNavigate();
  const config = HEADER_CONFIG[location.pathname] || {};

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {showBack || config.showBack ? (
          <button
            onClick={handleBack}
            className={styles.iconButton}
            aria-label="Go back"
          >
            <img src={backIcon} alt="Back" className={styles.icon} />
          </button>
        ) : null}

        {showMenu || config.showMenu ? (
          <button
            onClick={() => {
              if (onMenu) {
                onMenu();
              } else {
                toggleSidebar();
              }
            }}
            className={styles.iconButton}
            aria-label="Open menu"
          >
            <img src={menuIcon} alt="Menu" className={styles.icon} />
          </button>
        ) : null}

        <h1 className={styles.title}>{title || config.title}</h1>
      </div>

      <div className={styles.rightSection}>
        {showSearch || config.showSearch ? (
          <button
            onClick={onSearch}
            className={styles.iconButton}
            aria-label="Search"
          >
            <img src={searchIcon} alt="Search" className={styles.icon} />
          </button>
        ) : null}

        {showAdd || config.showAdd ? (
          <button
            onClick={onAdd}
            className={styles.iconButton}
            aria-label="Add new"
          >
            <img src={addIcon} alt="Add" className={styles.icon} />
          </button>
        ) : null}

        {showMore || config.showMore ? (
          <button
            onClick={onMore}
            className={styles.iconButton}
            aria-label="More options"
          >
            <img src={moreIcon} alt="More" className={styles.icon} />
          </button>
        ) : null}
      </div>
    </header>
  );
};

Header.propTypes = {
  onMenu: PropTypes.func,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  onMore: PropTypes.func,
  showBack: PropTypes.bool,
  showMenu: PropTypes.bool,
  title: PropTypes.string,
  showSearch: PropTypes.bool,
  showAdd: PropTypes.bool,
  showMore: PropTypes.bool,
};

Header.defaultProps = {
  onMenu: null,
  onSearch: () => {},
  onAdd: () => {},
  onMore: () => {},
};

export default Header;

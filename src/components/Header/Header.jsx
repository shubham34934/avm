import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useMemo } from "react";
import styles from "./Header.module.css";
import menuIcon from "../../assets/icons/menu.svg";
import searchIcon from "../../assets/icons/search.svg";
import closeIcon from "../../assets/icons/close.svg";
import addIcon from "../../assets/icons/add.svg";
import moreIcon from "../../assets/icons/more.svg";
import backIcon from "../../assets/icons/back.svg";
import { HEADER_CONFIG } from "../../constants/headerConfig";
import { useLayout } from "../../context/LayoutContext";
import { debounce } from "../../utils/debounce";
import FilterModal from "../FilterModal/FilterModal";

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
  filterProps = {},
}) => {
  const location = useLocation();
  const { toggleSidebar } = useLayout();
  const navigate = useNavigate();
  const config = HEADER_CONFIG[location.pathname] || {};
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Create a memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (onSearch) {
          onSearch(value);
        }
      }, 300),
    [onSearch]
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearchClick = () => {
    if (!isSearchExpanded) {
      setIsSearchExpanded(true);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleSearchClear = () => {
    setSearchValue("");
    setIsSearchExpanded(false);
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSearchBlur = () => {
    if (!searchValue) {
      setIsSearchExpanded(false);
    }
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

        {!isSearchExpanded && (
          <h1 className={styles.title}>{title || config.title}</h1>
        )}
      </div>

      <div className={styles.rightSection}>
        {(showSearch || config.showSearch) && (
          <div
            className={`${styles.searchContainer} ${
              isSearchExpanded ? styles.expanded : ""
            }`}
          >
            {isSearchExpanded ? (
              <div className={styles.searchInputContainer}>
                <img
                  src={searchIcon}
                  alt="Search"
                  className={styles.searchInputIconLeft}
                />
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onBlur={handleSearchBlur}
                  placeholder={`Search ${title || config.title || "items"}...`}
                  className={styles.searchInput}
                  autoFocus
                />
                <button
                  onClick={handleSearchClear}
                  className={styles.clearButton}
                  aria-label="Clear search"
                >
                  <img
                    src={closeIcon}
                    alt="Clear"
                    className={styles.clearIcon}
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSearchClick}
                className={styles.iconButton}
                aria-label="Search"
              >
                <img src={searchIcon} alt="Search" className={styles.icon} />
              </button>
            )}
          </div>
        )}

        {!isSearchExpanded && (showAdd || config.showAdd) && (
          <button
            onClick={onAdd}
            className={styles.iconButton}
            aria-label="Add new"
          >
            <img src={addIcon} alt="Add" className={styles.icon} />
          </button>
        )}

        {!isSearchExpanded && (showMore || config.showMore) && (
          <button
            onClick={onMore}
            className={styles.iconButton}
            aria-label="More options"
          >
            <img src={moreIcon} alt="More" className={styles.icon} />
          </button>
        )}
        {filterProps.showFilters ? (
          <FilterModal
            schema={filterProps.schema}
            initialValues={filterProps.filters}
            onApply={filterProps.onFilterChange}
            onClear={filterProps.onClearFilters}
          />
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
  filterProps: PropTypes.any,
};

Header.defaultProps = {
  onMenu: null,
  onSearch: () => {},
  onAdd: () => {},
  onMore: () => {},
};

export default Header;

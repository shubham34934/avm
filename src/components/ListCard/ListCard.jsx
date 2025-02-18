import PropTypes from "prop-types";
import styles from "./ListCard.module.css";
import Tag from "../Tag/Tag";
import moreIcon from "../../assets/icons/more.svg";

const ListCard = ({
  image,
  title,
  subtitle,
  status,
  onClick,
  menuIcon,
  onMenuClick,
  menuContent,
}) => {
  const renderSubtitle = () => {
    // If subtitle is a string, render as before
    if (typeof subtitle === "string") {
      return <span className={styles.subtitle}>{subtitle}</span>;
    }

    // If subtitle is an array or React fragment, render multiple lines
    return <div className={styles.subtitleMultiline}>{subtitle}</div>;
  };

  const handleCardClick = (e) => {
    // Only trigger onClick if the click wasn't on the menu button or menu content
    if (!e.target.closest(`.${styles.menuContainer}`)) {
      onClick?.(e);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.content}>
        <img src={image} alt={title} className={styles.image} />
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{title}</h3>
            {status && (
              <Tag text={status} variant={status.toLowerCase()} size="small" />
            )}
          </div>
          {renderSubtitle()}
        </div>
      </div>
      {menuIcon && (
        <div className={styles.menuContainer}>
          <button
            className={styles.moreButton}
            onClick={onMenuClick}
            aria-label="More options"
          >
            <img src={moreIcon} alt="More" className={styles.moreIcon} />
          </button>
          {menuContent}
        </div>
      )}
    </div>
  );
};

ListCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  status: PropTypes.string,
  onClick: PropTypes.func,
  menuIcon: PropTypes.string,
  onMenuClick: PropTypes.func,
  menuContent: PropTypes.node,
};

export default ListCard;

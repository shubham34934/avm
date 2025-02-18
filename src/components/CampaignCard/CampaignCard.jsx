import PropTypes from 'prop-types';
import styles from './CampaignCard.module.css';
import DateRange from '../DateRange/DateRange';
import moreIcon from "./../../assets/icons/more.svg"
import Tag from '../Tag/Tag';

const CampaignCard = ({
  name,
  startDate,
  endDate,
  brandName,
  brandLogo,
  amount,
  status = "",
  onClick,
  onMenuClick,
  menuContent
}) => {
  const handleMenuClick = (e) => {
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(e);
    }
  };

  const handleCardClick = (e) => {
    // Only trigger onClick if the click wasn't on the menu button or menu content
    if (!e.target.closest(`.${styles.menuContainer}`)) {
      onClick?.(e);
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick} role="button" tabIndex={0}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{name}</h3>
          <Tag text={status} variant={status.toLowerCase()} size="small" />
        </div>
        <div className={styles.menuContainer}>
          <button 
            className={styles.moreButton} 
            aria-label="More options"
            onClick={handleMenuClick}
            data-menu-button
          >
            <img src={moreIcon} alt="More" className={styles.moreIcon} />
          </button>
          {menuContent}
        </div>
      </div>
      <div className={styles.dateRange}>
        <DateRange startDate={startDate} endDate={endDate} />
      </div>
      <div className={styles.footer}>
        <div className={styles.brand}>
          <img src={brandLogo} alt={brandName} className={styles.brandLogo} />
          <span className={styles.brandName}>{brandName}</span>
        </div>
        <div className={styles.amount}>Rs {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
      </div>
    </div>
  );
};

CampaignCard.propTypes = {
  name: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  brandName: PropTypes.string.isRequired,
  brandLogo: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  menuContent: PropTypes.node
};

export default CampaignCard;

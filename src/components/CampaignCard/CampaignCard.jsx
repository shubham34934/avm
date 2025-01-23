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
  status="",
  onClick
}) => {
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{name}</h3>
          <Tag text={status} variant={status.toLowerCase()} size="small" />
        </div>
        <button className={styles.moreButton} aria-label="More options">
          <img src={moreIcon} alt="More" className={styles.moreIcon} />
        </button>
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
  onClick: PropTypes.func
};

export default CampaignCard;

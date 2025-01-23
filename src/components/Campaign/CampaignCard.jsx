import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';
import styles from './CampaignCard.module.css';

const CampaignCard = ({ 
  name, 
  startDate,
  endDate, 
  brand, 
  amount, 
  status 
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
        <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>
          {status}
        </span>
      </div>
      <div className={styles.details}>
        <div className={styles.dateRange}>
          {formatDate(startDate)} - {formatDate(endDate)}
        </div>
        <div className={styles.brand}>
          <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
          <span>{brand.name}</span>
        </div>
        <div className={styles.amount}>{formatCurrency(amount, 'INR')}</div>
      </div>
    </div>
  );
};

CampaignCard.propTypes = {
  name: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  brand: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
  }).isRequired,
  amount: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['In Progress', 'Complete', 'Pending']).isRequired,
};

export default CampaignCard;

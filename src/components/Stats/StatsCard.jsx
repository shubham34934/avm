import PropTypes from 'prop-types';
import styles from './StatsCard.module.css';

const StatsCard = ({ title, value, variant = 'default' }) => {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value.toLocaleString()}</p>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary']),
};

export default StatsCard;

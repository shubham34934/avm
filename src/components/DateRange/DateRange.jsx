import PropTypes from 'prop-types';
import styles from './DateRange.module.css';
import CalendarIcon from '../../assets/icons/calendar.svg';
const DateRange = ({ startDate, endDate }) => {
  return (
    <div className={styles.container}>
      <img src={CalendarIcon} alt="" className={styles.icon} />
      <span className={styles.text}>{startDate} - {endDate}</span>
    </div>
  );
};

DateRange.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired
};

export default DateRange;

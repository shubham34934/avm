import PropTypes from 'prop-types';
import styles from './Timeline.module.css';

const TimelineItem = ({ 
  icon, 
  title, 
  timestamp, 
  isActive, 
  isLast,
  reminder,
  description
}) => {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.timelineIcon}>
        <div className={`${styles.iconWrapper} ${isActive ? styles.active : ''}`}>
          <img src={icon} alt={title} className={styles.icon} />
        </div>
        {!isLast && <div className={styles.line} />}
      </div>
      
      <div className={styles.timelineContent}>
        <div className={styles.timelineHeader}>
          <h3 className={styles.timelineTitle}>{title}</h3>
          {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
        </div>
        {description && <p className={styles.description}>{description}</p>}
        {reminder && (
          <div className={styles.reminder}>
            <span className={styles.reminderIcon}>▶</span>
            <span className={styles.reminderText}>{reminder}</span>
          </div>
        )}
      </div>
    </div>
  );
};

TimelineItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.string,
  isActive: PropTypes.bool,
  isLast: PropTypes.bool,
  reminder: PropTypes.string,
  description: PropTypes.string
};

TimelineItem.defaultProps = {
  isActive: false,
  isLast: false
};

export default TimelineItem;

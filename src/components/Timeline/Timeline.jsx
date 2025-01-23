import PropTypes from 'prop-types';
import styles from './Timeline.module.css';

const TimelineItem = ({ icon, label, isActive, isCompleted, actions }) => (
  <div className={`${styles.timelineItem} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
    <div className={styles.timelineIcon}>
      {icon}
    </div>
    <div className={styles.timelineContent}>
      <span className={styles.label}>{label}</span>
      {actions && (
        <div className={styles.actions}>
          {actions}
        </div>
      )}
    </div>
  </div>
);

const Timeline = ({ items }) => {
  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <div key={index} className={styles.timelineItemWrapper}>
          <TimelineItem {...item} />
          {index < items.length - 1 && <div className={styles.connector} />}
        </div>
      ))}
    </div>
  );
};

Timeline.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    isCompleted: PropTypes.bool,
    actions: PropTypes.node
  })).isRequired
};

TimelineItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isCompleted: PropTypes.bool,
  actions: PropTypes.node
};

export default Timeline;

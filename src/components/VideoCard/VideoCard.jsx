import PropTypes from 'prop-types';
import { formatTimeAgo } from '../../utils/dateUtils';
import styles from './VideoCard.module.css';

const VideoCard = ({
  title,
  campaign,
  username,
  timestamp,
  status,
  thumbnail,
  onOptionsClick
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <img src={thumbnail} alt={title} />
        <span className={`${styles.status} ${styles[status?.toLowerCase()]}`}>
          {status}
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button 
            onClick={onOptionsClick} 
            className={styles.optionsButton}
            aria-label="More options"
          >
            ⋮
          </button>
        </div>
        <p className={styles.campaign}>{campaign}</p>
        <div className={styles.meta}>
          <span className={styles.username}>@{username}</span>
          <span className={styles.timestamp}>{formatTimeAgo(timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

VideoCard.propTypes = {
  title: PropTypes.string.isRequired,
  campaign: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['Pending', 'Approved', 'Rejected']).isRequired,
  thumbnail: PropTypes.string.isRequired,
  onOptionsClick: PropTypes.func.isRequired,
};

export default VideoCard;

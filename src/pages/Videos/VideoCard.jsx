import PropTypes from 'prop-types';
import styles from './VideoCard.module.css';
import Tag from '../../components/Tag/Tag';

const VideoCard = ({ 
  title, 
  campaignName, 
  userName, 
  timestamp, 
  status, 
  thumbnail 
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnailContainer}>
        <img 
          src={thumbnail} 
          alt={title} 
          className={styles.thumbnail}
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400/png';
          }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.moreButton} aria-label="More options">
            <svg className={styles.moreIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM10 18C10 16.9 10.9 16 12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <p className={styles.campaignName}>{campaignName}</p>
        <div className={styles.footer}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.timestamp}>{timestamp}</span>
          </div>
          <Tag text={status} variant={status.toLowerCase()} size="small" />
        </div>
      </div>
    </div>
  );
};

VideoCard.propTypes = {
  title: PropTypes.string.isRequired,
  campaignName: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
};

export default VideoCard;

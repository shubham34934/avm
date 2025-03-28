import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FeaturedVideo.module.css';

const FeaturedVideo = ({ video }) => {
  const navigate = useNavigate();

  return (
    <div 
      className={styles.container}
      onClick={() => navigate(`/videos/${video.id}`)}
    >
      <div className={styles.thumbnailContainer}>
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className={styles.thumbnail} 
        />
        <div className={styles.overlay}>
          <div className={styles.playButton}>
            <i className="fas fa-play"></i>
          </div>
          <div className={styles.badge}>{video.badge || 'Top Pick'}</div>
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.likes}>
          <i className="fas fa-thumbs-up"></i>
          <span>{video.likes}</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVideo;

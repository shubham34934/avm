import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VideoCarousel.module.css';
import rightArrowIcon from '../../assets/icons/rightArrow.svg';

const VideoCarousel = ({ videos, title, viewAllLink }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllLink && (
          <button 
            className={styles.viewAll} 
            onClick={() => navigate(viewAllLink)}
          >
            <img src={rightArrowIcon} alt="View All" className={styles.rightArrow} />
          </button>
        )}
      </div>
      <div className={styles.carousel}>
        {videos.map((video) => (
          <div 
            key={video.id} 
            className={styles.videoCard}
            onClick={() => navigate(`/videos/${video.id}`)}
          >
            <div className={styles.thumbnailContainer}>
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className={styles.thumbnail} 
              />
            </div>
            <div className={styles.videoInfo}>
              <h3 className={styles.videoTitle}>{video.title}</h3>
              <div className={styles.stats}>
                <div className={styles.likes}>
                  <i className="fas fa-thumbs-up"></i>
                  <span>{video.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;

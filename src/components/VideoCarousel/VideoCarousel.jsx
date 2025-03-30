import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VideoCarousel.module.css';
import { CirclePlayIcon, LikeIcon } from '../Icons/Icons';
import defaultThumbnail from '../../assets/images/default-thumbnail.png';

const VideoCarousel = ({ videos, title, viewAllLink }) => {
  const navigate = useNavigate();

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllLink && (
          <button 
            className={styles.viewAll} 
            onClick={() => navigate(viewAllLink)}
          >
            View all
          </button>
        )}
      </div>
      <div className={styles.carousel}>
        {videos.map((video) => (
          <div 
            key={video.id} 
            className={styles.videoCard}
            onClick={() => handleVideoClick(video.id)}
          >
            <div className={styles.thumbnailContainer}>
              <img 
                src={video.thumbnail || defaultThumbnail} 
                alt={video.title} 
                className={styles.thumbnail}
              />
              <div className={styles.overlay}>
                <div className={styles.likeCounter}>
                  <LikeIcon />
                  <span>{video.likes || 950}</span>
                </div>
                <div className={styles.playButton}>
                  <CirclePlayIcon />
                </div>
                <div className={styles.videoTitle}>
                  <h3>{video.title || 'Top Pick'}</h3>
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

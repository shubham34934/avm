import React from 'react';
import styles from './VideoCardDetailed.module.css';
import { LikeIcon, DislikeIcon, PlayIcon, MoreIcon } from '../Icons/Icons';

const VideoCardDetailed = ({ 
  video, 
  onVideoClick, 
  onLike, 
  onDislike, 
  onShortlist 
}) => {
  return (
    <div className={styles.videoCard}>
      <div className={styles.userInfo}>
        <img 
          src={video.userAvatar || "/images/avatar.jpg"} 
          alt={video.username} 
          className={styles.avatar}
        />
        <div className={styles.userMeta}>
          <span className={styles.username}>{video.username}</span>
          <span className={styles.timeAgo}>
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
        </div>
        <button 
          onClick={() => onShortlist(video.id)} 
          className={styles.moreButton}
        >
          <MoreIcon />
        </button>
      </div>

      <h2 className={styles.videoTitle}>{video.title}</h2>

      <div 
        className={styles.thumbnail} 
        onClick={() => onVideoClick(video.id)}
      >
        <img src={video.thumbnail} alt={video.title} />
        <div className={styles.playButton}>
          <PlayIcon />
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.likes}>
          <button 
            onClick={() => onLike(video.id, video.isLiked)}
            className={`${styles.actionButton} ${video.isLiked ? styles.active : ''}`}
          >
            <LikeIcon />
            <span>{video.likes}</span>
          </button>
          <button 
            onClick={() => onDislike(video.id, video.isDisliked)}
            className={`${styles.actionButton} ${video.isDisliked ? styles.active : ''}`}
          >
            <DislikeIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCardDetailed;

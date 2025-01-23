import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VideoPlayer.module.css';
import Header from '../../components/Header/Header';
import { LikeIcon, DislikeIcon } from '../../components/Icons/Icons';

// Mock data - replace with real data later
const videos = [
  {
    id: 1,
    url: 'https://www.youtube.com/embed/VIDEO_ID_1',
    title: 'Video Title ',
    username: '@user_name',
    likes: 950,
    isLiked: false
  },
  {
    id: 2,
    url: 'https://www.youtube.com/embed/VIDEO_ID_2',
    title: 'Another Video ',
    username: '@another_user',
    likes: 750,
    isLiked: false
  }
];

const VideoPlayer = () => {
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const videoContainerRef = useRef(null);
  const playerRefs = useRef({});
  const currentVideo = videos[currentVideoIndex];

  const handleBack = () => {
    navigate(-1);
  };

  const handleMore = () => {
    // Handle more options
  };

  const handleLike = () => {
    // Handle like action
  };

  const handleDislike = () => {
    // Handle dislike action
  };

  const handleShortlist = () => {
    // Handle shortlist action
  };

  const handleVideoClick = (index) => {
    const player = playerRefs.current[index];
    if (player) {
      if (isPlaying) {
        player.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        setShowPlayIcon(true);
      } else {
        player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        setShowPlayIcon(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleScroll = (e) => {
    const container = videoContainerRef.current;
    if (!container) return;

    const scrollPosition = container.scrollTop;
    const videoHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / videoHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
      setIsPlaying(true);
      setShowPlayIcon(false);
    }
  };

  useEffect(() => {
    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentVideoIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={handleBack} className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={styles.pageTitle}>Videos</span>
        <button onClick={handleMore} className={styles.moreButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div 
        ref={videoContainerRef}
        className={styles.videoContainer}
      >
        {videos.map((video, index) => (
          <div key={video.id} className={styles.videoWrapper}>
            <div 
              className={styles.video}
              onClick={() => handleVideoClick(index)}
            >
              <iframe
                ref={el => playerRefs.current[index] = el}
                src={`${video.url}?autoplay=${index === currentVideoIndex ? 1 : 0}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&widget_referrer=${window.location.origin}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {showPlayIcon && index === currentVideoIndex && (
                <div className={styles.playIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                  </svg>
                </div>
              )}
            </div>

            <div className={styles.overlay}>
              <div className={styles.videoInfo}>
                <div className={styles.userInfo}>
                  <img 
                    src="/images/avatar.jpg" 
                    alt={video.username} 
                    className={styles.avatar}
                  />
                  <span className={styles.username}>{video.username}</span>
                </div>
                <h2 className={styles.title}>{video.title}</h2>
              </div>

              <div className={styles.sideActions}>
                <button 
                  className={`${styles.actionButton} ${video.isLiked ? styles.liked : ''}`}
                  onClick={handleLike}
                >
                  <LikeIcon />
                  <span>{video.likes}</span>
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={handleDislike}
                >
                  <DislikeIcon />
                </button>
              </div>

              <button 
                className={styles.shortlistButton}
                onClick={handleShortlist}
              >
                Shortlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;

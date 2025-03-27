import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VideoPlayer.module.css";
import {
  LikeIcon,
  DislikeIcon,
  BackIcon,
  MoreIcon,
  PlayIcon,
  ShareIcon,
  MoreIconVerticle,
} from "../../components/Icons/Icons";
// Mock data - replace with real data later
const videos = [
  {
    id: 1,
    url: "https://www.youtube.com/embed/VIDEO_ID_1",
    title: "Video Title ",
    username: "@user_name",
    likes: 950,
    isLiked: false,
  },
  {
    id: 2,
    url: "https://www.youtube.com/embed/VIDEO_ID_2",
    title: "Another Video ",
    username: "@another_user",
    likes: 750,
    isLiked: false,
  },
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
        player.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*"
        );
        setShowPlayIcon(true);
      } else {
        player.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
        setShowPlayIcon(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleScroll = useCallback(
    (e) => {
      const container = videoContainerRef.current;
      if (!container) return;

      const scrollPosition = container.scrollTop;
      const videoHeight = container.clientHeight;
      const newIndex = Math.round(scrollPosition / videoHeight);

      if (
        newIndex !== currentVideoIndex &&
        newIndex >= 0 &&
        newIndex < videos.length
      ) {
        setCurrentVideoIndex(newIndex);
        setIsPlaying(true);
        setShowPlayIcon(false);
      }
    },
    [currentVideoIndex, videos.length]
  );

  useEffect(() => {
    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={handleBack} className={styles.backButton}>
          <BackIcon />
        </button>
        <span className={styles.pageTitle}>Videos</span>
        <button onClick={handleMore} className={styles.moreButton}>
          <MoreIcon />
        </button>
      </div>

      <div ref={videoContainerRef} className={styles.videoContainer}>
        {videos.map((video, index) => (
          <div key={video.id} className={styles.videoWrapper}>
            <div
              className={styles.video}
              onClick={() => handleVideoClick(index)}
            >
              <iframe
                ref={(el) => (playerRefs.current[index] = el)}
                src={`${video.url}?autoplay=${
                  index === currentVideoIndex ? 1 : 0
                }&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${
                  window.location.origin
                }&widget_referrer=${window.location.origin}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {showPlayIcon && index === currentVideoIndex && (
                <div className={styles.playIcon}>
                  <PlayIcon />
                </div>
              )}
            </div>

            <div className={styles.overlay}>
              <div className={styles.videoInfo}>
                <div className={styles.details}>
                  <div className={styles.userInfo}>
                    <img
                      src="/images/avatar.jpg"
                      alt={video.username}
                      className={styles.avatar}
                    />
                    <div className={styles.userInfoDetails}>
                      <h2 className={styles.title}>{video.title}</h2>
                      <div className={styles.username}>{video.username}</div>
                    </div>
                  </div>
                </div>
                <button className={styles.actionButton}>
                  <MoreIconVerticle />
                </button>
              </div>

              <div className={styles.sideActions}>
                <button
                  className={`${styles.actionButton} ${
                    video.isLiked ? styles.liked : ""
                  }`}
                  onClick={handleLike}
                >
                  <LikeIcon />
                  <span>{video.likes}</span>
                </button>
                <button className={styles.actionButton} onClick={handleDislike}>
                  <DislikeIcon />
                </button>
                <button className={styles.actionButton}>
                  <ShareIcon />
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

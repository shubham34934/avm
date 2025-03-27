import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
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
import {
  navigateToNextVideo,
  navigateToPreviousVideo,
} from "../../reducers/videoNavigation";
import { fetchVideoPosts } from "../../reducers/videoPosts";
import { toggleLike, toggleShortlist } from "../../reducers/submissions";

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: currentVideoId } = useParams();

  const { videoList, currentVideoIndex, navigationContext } = useSelector(
    (state) => state.videoNavigation
  );

  const videoContainerRef = useRef(null);
  const playerRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (videoList.length === 0) {
      dispatch(fetchVideoPosts({ page: 0, size: 100, sort: "createdOn,desc" }));
    }
  }, [videoList, dispatch]);

  const handleBack = () => navigate(-1);

  const handleVideoClick = (index) => {
    const player = playerRefs.current[index];
    if (!player) return;

    const action = isPlaying ? "pauseVideo" : "playVideo";
    player.contentWindow.postMessage(
      `{"event":"command","func":"${action}","args":""}`,
      "*"
    );
    setIsPlaying(!isPlaying);
  };

  const handleLike = async (videoId) => {
    try {
      await dispatch(
        toggleLike({ submissionId: videoId, isLike: true })
      ).unwrap();
    } catch {
      toast.error("Failed to like video");
    }
  };

  const handleDislike = async (videoId) => {
    try {
      await dispatch(
        toggleLike({ submissionId: videoId, isLike: false })
      ).unwrap();
    } catch {
      toast.error("Failed to dislike video");
    }
  };

  const handleShortlist = async (videoId) => {
    try {
      await dispatch(toggleShortlist({ submissionId: videoId })).unwrap();
    } catch {
      toast.error("Failed to shortlist video");
    }
  };

  const handleScroll = useCallback(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const { scrollTop, clientHeight } = container;
    const middlePoint = clientHeight / 2;

    playerRefs.current.forEach((player, index) => {
      if (!player) return;
      const rect = player.getBoundingClientRect();
      if (rect.top < middlePoint && rect.bottom > middlePoint) {
        setIsPlaying(true);
        player.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      } else {
        player.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*"
        );
      }
    });
  }, []);

  useEffect(() => {
    const container = videoContainerRef.current;
    if (container) container.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!videoList || videoList.length === 0)
    return <div>No videos available</div>;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={handleBack} className={styles.backButton}>
          <BackIcon />
        </button>
        <span className={styles.pageTitle}>Videos</span>
        <button className={styles.moreButton}>
          <MoreIcon />
        </button>
      </div>

      <div
        ref={videoContainerRef}
        className={styles.videoContainer}
        style={{ height: "100vh", overflowY: "scroll" }}
      >
        {videoList.map((video, index) => (
          <div key={video.id} className={styles.videoWrapper}>
            <div
              className={styles.video}
              onClick={() => handleVideoClick(index)}
            >
              <iframe
                ref={(el) => (playerRefs.current[index] = el)}
                src={`${video.videoUrl}?autoplay=0&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className={styles.overlay}>
              <div className={styles.videoInfo}>
                <div className={styles.details}>
                  <div className={styles.userInfo}>
                    <img
                      src={video.userProfilePicture || "/images/avatar.jpg"}
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
                  className={styles.actionButton}
                  onClick={() => handleLike(video.id)}
                >
                  <LikeIcon />
                  <span>{video.likes || 0}</span>
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDislike(video.id)}
                >
                  <DislikeIcon />
                </button>
                <button className={styles.actionButton}>
                  <ShareIcon />
                </button>
              </div>
              <button
                className={styles.shortlistButton}
                onClick={() => handleShortlist(video.id)}
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

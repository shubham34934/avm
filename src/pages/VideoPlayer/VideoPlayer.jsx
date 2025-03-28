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
  ShareIcon,
  MoreIconVerticle,
} from "../../components/Icons/Icons";
import { setVideoList } from "../../reducers/videoNavigation";
import { fetchVideoPosts, fetchVideoPostById } from "../../reducers/videoPosts";
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
    // If we have a specific video ID from the URL
    if (currentVideoId) {
      // First try to find the video in the existing list
      const videoIndex = videoList.findIndex(
        (v) => v.id === parseInt(currentVideoId)
      );

      if (videoIndex >= 0) {
        // If found, just update the current index
        dispatch(
          setVideoList({
            videos: videoList,
            initialIndex: videoIndex,
            context: navigationContext,
          })
        );
      } else {
        // If not found or videoList is empty, fetch the specific video
        dispatch(fetchVideoPostById(parseInt(currentVideoId)))
          .unwrap()
          .then((video) => {
            if (video) {
              // If video is found, set it as the only video in the list
              dispatch(
                setVideoList({
                  videos: [video],
                  initialIndex: 0,
                  context: "single",
                })
              );
            }
          })
          .catch(() => {
            toast.error("Failed to load video");
          });
      }
    }

    // If no videos are loaded yet, fetch all videos
    if (videoList.length === 0) {
      dispatch(fetchVideoPosts({ page: 0, size: 100, sort: "createdOn,desc" }))
        .unwrap()
        .then((response) => {
          if (response && response.content && response.content.length > 0) {
            // If we have videos and a specific ID, find that video's index
            let initialIndex = 0;
            if (currentVideoId) {
              const foundIndex = response.content.findIndex(
                (v) => v.id === parseInt(currentVideoId)
              );
              if (foundIndex >= 0) initialIndex = foundIndex;
            }

            dispatch(
              setVideoList({
                videos: response.content,
                initialIndex: initialIndex,
                context: "all",
              })
            );
          }
        })
        .catch(() => {
          toast.error("Failed to load videos");
        });
    }
  }, [currentVideoId, dispatch, videoList.length]);

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

  // Function to convert regular YouTube URLs to embed URLs
  const getEmbedUrl = (url) => {
    if (!url) return "";

    // Handle YouTube URLs
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Extract video ID
      let videoId = "";

      if (url.includes("youtube.com/watch")) {
        // Format: https://www.youtube.com/watch?v=VIDEO_ID
        const urlParams = new URLSearchParams(url.split("?")[1]);
        videoId = urlParams.get("v");
      } else if (url.includes("youtu.be")) {
        // Format: https://youtu.be/VIDEO_ID
        videoId = url.split("/").pop();
      } else if (url.includes("youtube.com/embed")) {
        // Already an embed URL
        return `${url}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`;
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`;
      }
    }

    // If not a recognized format or not YouTube, return original with parameters
    return `${url}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`;
  };

  if (!videoList || videoList.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingMessage}>Loading videos...</div>
      </div>
    );
  }

  // Get the current video based on the index
  const currentVideo = videoList[currentVideoIndex];

  if (!currentVideo) {
    return <div className={styles.errorMessage}>No video available</div>;
  }

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
                src={getEmbedUrl(video.url || video.videoUrl)}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen; accelerometer; gyroscope; muted"
                allowFullScreen
                loading="lazy"
                frameBorder="0"
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
                      <div className={styles.username}>@{video.createdBy}</div>
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

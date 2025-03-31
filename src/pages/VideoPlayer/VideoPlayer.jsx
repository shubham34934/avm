import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import defaultAvatar from "../../assets/images/default-avatar.png";

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
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoData, setCurrentVideoData] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [urlUpdateInProgress, setUrlUpdateInProgress] = useState(false);

  // Check if we already have the video in the list
  const findVideoInList = useCallback(
    (videoId) => {
      if (!videoList || videoList.length === 0 || !videoId) return -1;
      return videoList.findIndex((v) => v.id === parseInt(videoId));
    },
    [videoList]
  );

  useEffect(() => {
    if (urlUpdateInProgress) {
      setUrlUpdateInProgress(false);
      return;
    }
    setIsLoading(true);
    setCurrentVideoData(null);
    setInitialScrollDone(false);
    if (currentVideoId) {
      const existingIndex = findVideoInList(currentVideoId);
      if (existingIndex >= 0 && videoList.length > 0) {
        dispatch(
          setVideoList({
            videos: videoList,
            initialIndex: existingIndex,
            context: navigationContext,
          })
        );
        setIsLoading(false);
      } else {
        dispatch(fetchVideoPostById(parseInt(currentVideoId)))
          .unwrap()
          .then((video) => {
            if (video) {
              setCurrentVideoData(video);
              dispatch(
                setVideoList({
                  videos: [video],
                  initialIndex: 0,
                  context: "single",
                })
              );
              fetchAllVideos(parseInt(currentVideoId));
            } else {
              toast.error("Video not found");
              setIsLoading(false);
            }
          })
          .catch((error) => {
            toast.error("Failed to load video");
            setIsLoading(false);
          });
      }
    } else {
      fetchAllVideos();
    }
  }, [
    currentVideoId,
    dispatch,
    findVideoInList,
    navigationContext,
    videoList,
    urlUpdateInProgress,
  ]);

  const fetchAllVideos = (targetVideoId = null) => {
    dispatch(fetchVideoPosts({ page: 0, size: 100, sort: "createdOn,desc" }))
      .unwrap()
      .then((response) => {
        const videoContent = Array.isArray(response)
          ? response
          : response && response.content
          ? response.content
          : [];

        if (videoContent && videoContent.length > 0) {
          let initialIndex = 0;
          if (targetVideoId) {
            const foundIndex = videoContent.findIndex(
              (v) => v.id === targetVideoId
            );
            if (foundIndex >= 0) {
              initialIndex = foundIndex;
            } else {
              console.warn(
                "Target video not found in the list, defaulting to index 0"
              );
            }
          }
          dispatch(
            setVideoList({
              videos: videoContent,
              initialIndex: initialIndex,
              context: "all",
            })
          );
        } else {
          console.error("No videos found");
          toast.error("No videos available");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all videos:", error);
        toast.error("Failed to load videos");
        setIsLoading(false);
      });
  };

  const handleBack = () => navigate(-1);

  const handleVideoClick = (index) => {
    const player = playerRefs.current[index];
    if (!player) return;

    try {
      const action = isPlaying ? "pauseVideo" : "playVideo";
      player.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: action,
          args: "",
        }),
        "*"
      );
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error controlling video:", error);
    }
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

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const updateUrlWithDebounce = useCallback(
    debounce((videoId) => {
      setUrlUpdateInProgress(true);
      navigate(`/videos/${videoId}`, { replace: true });
    }, 300),
    [navigate]
  );

  const handleScroll = useCallback(() => {
    if (isScrolling) return; // Skip if already scrolling

    const container = videoContainerRef.current;
    if (!container || videoList.length === 0) return;

    const { scrollTop, clientHeight } = container;
    const middlePoint = clientHeight / 2;

    let activeVideoIndex = -1;
    let closestDistance = Infinity;

    // Find the closest video to the middle of the viewport
    const videoElements = container.querySelectorAll(`.${styles.videoWrapper}`);
    videoElements.forEach((element, index) => {
      if (index >= videoList.length) return;
      
      const rect = element.getBoundingClientRect();
      const distanceToMiddle = Math.abs(
        rect.top + rect.height / 2 - middlePoint
      );

      if (distanceToMiddle < closestDistance) {
        closestDistance = distanceToMiddle;
        activeVideoIndex = index;
      }
    });

    if (activeVideoIndex !== -1 && activeVideoIndex !== currentVideoIndex) {
      const videoId = videoList[activeVideoIndex].id;

      // Update URL only if the video ID has changed
      if (currentVideoId !== videoId.toString()) {
        updateUrlWithDebounce(videoId);
      }

      // Update the current video index in Redux
      dispatch(
        setVideoList({
          videos: videoList,
          initialIndex: activeVideoIndex,
          context: navigationContext,
        })
      );
    }
  }, [videoList, currentVideoId, updateUrlWithDebounce, isScrolling, currentVideoIndex, dispatch, navigationContext]);

  useEffect(() => {
    if (
      isLoading ||
      initialScrollDone ||
      videoList.length === 0 ||
      currentVideoIndex < 0
    )
      return;

    const container = videoContainerRef.current;
    if (!container) return;

    const videoElements = container.querySelectorAll(`.${styles.videoWrapper}`);
    if (videoElements.length > currentVideoIndex) {
      setIsScrolling(true);
      setTimeout(() => {
        videoElements[currentVideoIndex].scrollIntoView({ behavior: "auto" });
        setInitialScrollDone(true);
        setTimeout(() => {
          setIsScrolling(false);
        }, 500);
      }, 100);
    }
  }, [isLoading, videoList, currentVideoIndex, initialScrollDone]);

  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;
    let scrollTimeout;
    const throttledScrollHandler = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 100);
    };
    container.addEventListener("scroll", throttledScrollHandler);
    return () => {
      container.removeEventListener("scroll", throttledScrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll]);

  const getEmbedUrl = (url, autoplay = false) => {
    if (!url) return "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        videoId = urlParams.get("v");
      } else if (url.includes("youtu.be")) {
        videoId = url.split("/").pop();
      } else if (url.includes("youtube.com/embed")) {
        videoId = url.split("/").pop();
        if (videoId.includes("?")) {
          videoId = videoId.split("?")[0];
        }
      } else if (url.includes("youtube.com/shorts")) {
        videoId = url.split("/").pop();
        if (videoId.includes("?")) {
          videoId = videoId.split("?")[0];
        }
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${autoplay ? 1 : 0}&mute=0&controls=1&rel=0&showinfo=0&modestbranding=1&origin=${window.location.origin}`;
      }
    }
    return url;
  };

  const getVideoIdFromUrl = (url) => {
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      return urlParams.get("v");
    } else if (url.includes("youtu.be")) {
      return url.split("/").pop();
    } else if (url.includes("youtube.com/embed")) {
      return url.split("/").pop().split("?")[0];
    } else if (url.includes("youtube.com/shorts")) {
      return url.split("/").pop().split("?")[0];
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingMessage}>Loading video...</div>
      </div>
    );
  }

  if (!videoList || videoList.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>No videos available</div>
        <button onClick={handleBack} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }
  const currentVideo = videoList[currentVideoIndex];
  if (!currentVideo) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>Video not found</div>
        <button onClick={handleBack} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
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
        {videoList.map((video, index) => {
          // Only render iframe for current video and adjacent videos (for smoother navigation)
          const shouldRenderIframe = Math.abs(index - currentVideoIndex) <= 1;
          const videoUrl = video.url || video.videoUrl;

          return (
            <div key={video.id} className={styles.videoWrapper}>
              <div
                className={styles.video}
                onClick={() => handleVideoClick(index)}
              >
                {shouldRenderIframe ? (
                  <iframe
                    ref={(el) => (playerRefs.current[index] = el)}
                    src={getEmbedUrl(videoUrl, index === currentVideoIndex)}
                    title={video.title}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen; accelerometer; gyroscope"
                    allowFullScreen
                    loading="lazy"
                    frameBorder="0"
                  />
                ) : (
                  <div className={styles.placeholderVideo}>
                    <img
                      src={
                        video.thumbnail ||
                        `https://img.youtube.com/vi/${getVideoIdFromUrl(
                          videoUrl
                        )}/hqdefault.jpg`
                      }
                      alt={video.title}
                      className={styles.thumbnailImage}
                    />
                  </div>
                )}
              </div>
              <div className={styles.overlay}>
                <div className={styles.videoInfo}>
                  <div className={styles.details}>
                    <div className={styles.userInfo}>
                      <img
                        src={video.userProfilePicture || defaultAvatar}
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
          );
        })}
      </div>
    </div>
  );
};

export default VideoPlayer;

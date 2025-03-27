import React from "react";
import styles from "./VideoCardDetailed.module.css";
import { LikeIcon, DislikeIcon, PlayIcon, MoreIcon } from "../Icons/Icons";
import defaultAvatar from "./../../assets/images/default-avatar.png";
import defaultThumbnail from "./../../assets/images/default-thumbnail.png";

// Function to extract YouTube thumbnail
const getYouTubeThumbnail = (videoUrl) => {
  try {
    // Regular expressions to match different YouTube URL formats
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoUrl.match(youtubeRegex);

    if (match && match[1]) {
      const videoId = match[1];
      // Return different quality thumbnails in order of preference
      const thumbnailSizes = [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/default.jpg`,
      ];
      return thumbnailSizes;
    }
  } catch (error) {
    console.error("Error extracting YouTube thumbnail:", error);
  }
  return null;
};

const VideoCardDetailed = ({
  video,
  onVideoClick,
  onLike,
  onDislike,
  onShortlist,
}) => {
  // Try to get YouTube thumbnails if the thumbnail is a YouTube URL
  const youtubeThumbnails =
    video.thumbnail && getYouTubeThumbnail(video.thumbnail);

  // Fallback logic for thumbnail
  const thumbnailSrc = youtubeThumbnails
    ? youtubeThumbnails[0]
    : video.thumbnail || defaultThumbnail;

  return (
    <div className={styles.videoCard}>
      <div className={styles.userInfo}>
        <img
          src={video.userAvatar || defaultAvatar}
          alt={video.username}
          className={styles.avatar}
        />
        <div className={styles.userMeta}>
          <span className={styles.username}>@{video.username}</span>
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
      <div className={styles.thumbnail} onClick={() => onVideoClick(video.id)}>
        <img
          src={thumbnailSrc}
          alt={video.title}
          onError={(e) => {
            // e.target.src = defaultThumbnail;
          }}
        />
        <div className={styles.playButton}>
          <PlayIcon />
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.likes}>
          <button
            onClick={() => onLike(video.id, video.isLiked)}
            className={`${styles.actionButton} ${
              video.isLiked ? styles.active : ""
            }`}
          >
            <LikeIcon />
            <span>{video.likes}</span>
          </button>
          <button
            onClick={() => onDislike(video.id, video.isDisliked)}
            className={`${styles.actionButton} ${
              video.isDisliked ? styles.active : ""
            }`}
          >
            <DislikeIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCardDetailed;

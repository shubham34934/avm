import React, { useState } from "react";
import styles from "./VideoCardDetailed.module.css";
import { LikeIcon, DislikeIcon, MoreIcon, CirclePlayIcon } from "../Icons/Icons";
import defaultAvatar from "./../../assets/images/default-avatar.png";
import defaultThumbnail from "./../../assets/images/default-thumbnail.png";
import { getYouTubeThumbnail } from "../../utils/videoUtils";

const VideoCardDetailed = ({
  video,
  onVideoClick,
  onLike,
  onDislike,
  onShortlist,
  onEdit,
  onDelete,
  onView,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Try to get YouTube thumbnails if the thumbnail is a YouTube URL
  const youtubeThumbnails =
    video.thumbnail && getYouTubeThumbnail(video.thumbnail);

  // Fallback logic for thumbnail
  const thumbnailSrc = youtubeThumbnails
    ? youtubeThumbnails[0]
    : video.thumbnail || defaultThumbnail;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: buttonRect.bottom,
      left: buttonRect.right - 120, // Adjust to position the popover correctly
    });
    setShowMenu(!showMenu);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleActionClick = (action, e) => {
    e.stopPropagation(); // Prevent card click
    handleCloseMenu();

    switch (action) {
      case "view":
        onView && onView(video.id);
        break;
      case "edit":
        onEdit && onEdit(video.id);
        break;
      case "delete":
        onDelete && onDelete(video.id);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.videoCard}>
      <div className={styles.userInfo}>
        <img
          src={video.userAvatar || defaultAvatar}
          alt={video.username}
          className={styles.avatar}
        />
        <div className={styles.userMeta}>
          <div className={styles.userMetaTop}>
            <span className={styles.username}>@{video.username}</span>
            <span className={styles.dot}>u2022</span>
            <span className={styles.timeAgo}>
              {formatDate(video.createdAt)}
            </span>
          </div>
        </div>
        <button
          onClick={handleMenuClick}
          className={styles.moreButton}
        >
          <MoreIcon />
        </button>
        {showMenu && (
          <div
            className={styles.menuPopover}
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              position: 'absolute',
              zIndex: 1000,
            }}
          >
            <div className={styles.menuOptions}>
              <button
                className={styles.menuOption}
                onClick={(e) => handleActionClick("view", e)}
              >
                View
              </button>
              <button
                className={styles.menuOption}
                onClick={(e) => handleActionClick("edit", e)}
              >
                Edit
              </button>
              <button
                className={`${styles.menuOption} ${styles.deleteOption}`}
                onClick={(e) => handleActionClick("delete", e)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <h2 className={styles.videoTitle}>{video.title}</h2>
      
      <div className={styles.thumbnailContainer}>
        <div className={styles.thumbnail} onClick={() => onVideoClick(video.id)}>
          <img
            src={thumbnailSrc}
            alt={video.title}
            onError={(e) => {
              // e.target.src = defaultThumbnail;
            }}
          />
          <div className={styles.playButton}>
            <CirclePlayIcon />
          </div>
        </div>
        
        <div className={styles.actionButtons}>
          <div className={styles.likeButton}>
            <button
              onClick={() => onLike(video.id, video.isLiked)}
              className={`${styles.actionButton} ${video.isLiked ? styles.active : ""}`}
            >
              <LikeIcon />
              <span>{video.likes}</span>
            </button>
          </div>
          
          <div className={styles.dislikeButton}>
            <button
              onClick={() => onDislike(video.id, video.isDisliked)}
              className={`${styles.actionButton} ${video.isDisliked ? styles.active : ""}`}
            >
              <DislikeIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardDetailed;

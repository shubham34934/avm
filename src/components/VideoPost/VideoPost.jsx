import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VideoPost.module.css";

const VideoPost = ({ post }) => {
  const navigate = useNavigate();

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  console.log({ post });
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img
            src={post.userAvatar}
            alt={post.username}
            className={styles.avatar}
          />
          <div>
            <span className={styles.username}>{post.username}</span>
            <span className={styles.timeAgo}>
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        <button className={styles.moreButton}>
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      <h3 className={styles.title}>{post.title}</h3>

      <div
        className={styles.videoContainer}
        onClick={() => navigate(`/videos/${post.id}`)}
      >
        <img
          src={post.thumbnail}
          alt={post.title}
          className={styles.thumbnail}
        />
        <div className={styles.playOverlay}>
          <div className={styles.playButton}>
            <i className="fas fa-play"></i>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionButton}>
          <i className="fas fa-thumbs-up"></i>
          <span>{post.likes}</span>
        </button>
        <button className={styles.actionButton}>
          <i className="fas fa-comment"></i>
          <span>{post.comments}</span>
        </button>
      </div>
    </div>
  );
};

export default VideoPost;

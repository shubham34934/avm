import PropTypes from "prop-types";
import styles from "./VideoCard.module.css";
import Tag from "../../components/Tag/Tag";
import defaultThumbnail from "./../../assets/images/default-thumbnail.png";
import { getYouTubeThumbnail } from "../../utils/videoUtils";

const VideoCard = ({
  title,
  campaignName,
  userName,
  timestamp,
  status = "",
  thumbnail,
  onClick,
  onEdit,
  onDelete,
  onView,
  showMenu,
  onMenuClick,
  onCloseMenu,
  tags = [],
}) => {
  // Try to get YouTube thumbnails if the thumbnail is a YouTube URL
  const youtubeThumbnails = thumbnail && getYouTubeThumbnail(thumbnail);

  // Fallback logic for thumbnail
  const thumbnailSrc = youtubeThumbnails
    ? youtubeThumbnails[0]
    : thumbnail || defaultThumbnail;

  const handleActionClick = (action, e) => {
    e.stopPropagation(); // Prevent card click
    onCloseMenu();

    switch (action) {
      case "view":
        onView && onView();
        break;
      case "edit":
        onEdit && onEdit();
        break;
      case "delete":
        onDelete && onDelete();
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.thumbnailContainer}>
        <img
          src={thumbnailSrc}
          alt={title}
          className={styles.thumbnail}
          onError={(e) => {
            // Fallback to default thumbnail if YouTube thumbnail fails
            e.target.src = defaultThumbnail;
          }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.menuContainer}>
            <button
              className={styles.moreButton}
              aria-label="More options"
              onClick={onMenuClick}
              data-menu-button
            >
              <svg
                className={styles.moreIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM10 18C10 16.9 10.9 16 12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
        <p className={styles.campaignName}>{campaignName}</p>
        <div className={styles.footer}>
          <div className={styles.userInfo}>
            {userName && <span className={styles.userName}>@{userName}</span>}
            <span className={styles.timestamp}>{timestamp}</span>
          </div>
          <div className={styles.tags}>
            {/* Display the status tag if no custom tags are provided */}
            {tags.length === 0 && status && (
              <Tag text={status} variant={status.toLowerCase()} size="small" />
            )}

            {/* Display all custom tags */}
            {tags.map((tag, index) => (
              <Tag
                key={index}
                text={tag.text}
                variant={tag.variant}
                size="small"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

VideoCard.propTypes = {
  title: PropTypes.string.isRequired,
  campaignName: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  showMenu: PropTypes.bool,
  onMenuClick: PropTypes.func,
  onCloseMenu: PropTypes.func,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      variant: PropTypes.string.isRequired,
    })
  ),
};

export default VideoCard;

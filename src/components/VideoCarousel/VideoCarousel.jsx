import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VideoCarousel.module.css";
import rightArrowIcon from "../../assets/icons/rightArrow.svg";
import defaultThumbnail from "../../assets/images/default-thumbnail.png";
import { StackedCarousel } from "react-stacked-center-carousel";
import { LikeIcon, CirclePlayIcon } from "../Icons/Icons";

const VideoCarousel = ({ videos = [], title, viewAllLink }) => {
  const navigate = useNavigate();
  const ref = useRef();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Calculate card dimensions based on Instagram Reels aspect ratio (9:16)
  const getCardDimensions = () => {
    const width = dimensions.width > 768 ? 360 : 270; 
    const height = (width * 16) / 9; 
    return { width, height };
  };

  const cardDimensions = getCardDimensions();

  // Format data for the carousel
  const formattedVideos =
    videos.length > 0
      ? videos.map((video) => ({
          id: video.id,
          cover: video.thumbnail || defaultThumbnail,
          title: video.title || "Video",
          likes: video.likes || 0,
        }))
      : [
          { id: 1, cover: defaultThumbnail, title: "Top Pick", likes: 950 },
          {
            id: 2,
            cover: defaultThumbnail,
            title: "Featured Video",
            likes: 850,
          },
          {
            id: 3,
            cover: defaultThumbnail,
            title: "Popular Content",
            likes: 750,
          },
        ];

  // Card component for the stacked carousel
  const Card = ({ dataIndex, data, props }) => {
    // Ensure data and dataIndex are valid before destructuring
    if (
      !data ||
      dataIndex === undefined ||
      dataIndex < 0 ||
      dataIndex >= data.length
    ) {
      return null;
    }

    const item = data[dataIndex];
    if (!item) {
      return null;
    }

    const { cover, title, likes, id } = item;

    // Apply different styles for the active (center) card
    const isActive = props?.position === 0;
    const cardStyle = isActive ? { width: cardDimensions.width * 1.1 } : {}; 

    return (
      <div
        className={`${styles.card} ${
          isActive ? styles.activeCard : ""
        }`}
        style={cardStyle}
        draggable={false}
        {...props}
        onClick={() => isActive && navigate(`/videos/${id}`)}
      >
        <div className={styles.cardContent}>
          <div className={styles.thumbnailContainer}>
            <img
              className={styles.thumbnail}
              src={cover || defaultThumbnail}
              alt={title}
              draggable={false}
            />
            <div className={styles.overlay}>
              <div className={styles.likeCounter}>
                <LikeIcon />
                <span>{likes || 0}</span>
              </div>
              <div className={styles.bottomRow}>
                <div className={styles.videoTitle}>
                  <h3>{title}</h3>
                </div>
                <div 
                  className={styles.playButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    navigate(`/videos/${id}`);
                  }}
                >
                  <CirclePlayIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllLink && (
          <button
            className={styles.viewAll}
            onClick={() => navigate(viewAllLink)}
          >
            <img
              src={rightArrowIcon}
              alt="View All"
              className={styles.rightArrow}
            />
          </button>
        )}
      </div> */}
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselContainer}>
          {formattedVideos.length > 0 && (
            <StackedCarousel
              ref={ref}
              slideComponent={Card}
              slideWidth={cardDimensions.width}
              carouselWidth={dimensions.width > 768 ? 900 : 350} 
              data={formattedVideos}
              maxVisibleSlide={3}
              disableSwipe={false}
              customScales={[1, 0.8, 0.6]}
              transitionTime={450}
              height={cardDimensions.height}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel;

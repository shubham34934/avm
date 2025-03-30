import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserHome.module.css";
import VideoCarousel from "../../components/VideoCarousel/VideoCarousel";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import Header from "../../components/Header/Header";
import SubmissionsSection from "../../components/SubmissionsSection/SubmissionsSection";
import VideoCardDetailed from "../../components/VideoCardDetailed/VideoCardDetailed";
import { ENV } from "../../config/env";
import axios from "axios";
import userAvatar from "../../assets/images/users/1.png";
// Import the category images
import trendingImage from "../../assets/images/homepage/trending.png";
import mostRecentImage from "../../assets/images/homepage/mostRecent.png";
import comedyImage from "../../assets/images/homepage/comedy.png";
import techImage from "../../assets/images/homepage/tech.png";

const UserHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popularVideos, setPopularVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [feedVideos, setFeedVideos] = useState([]);
  const [topVideos, setTopVideos] = useState([]);
  const [loadingTopVideos, setLoadingTopVideos] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch popular videos
        const popularResponse = await axios.get(
          `${ENV.VITE_APP_API_URL}/video-posts`,
          {
            params: {
              sort: "likes,desc",
              size: 10,
            },
          }
        );

        // Transform data for our UI
        const popularData = popularResponse.data.map((video) => ({
          id: video.id,
          title: video.title,
          thumbnail: video.url,
          likes: Math.floor(Math.random() * 5000) + 500, // Placeholder for likes
        }));

        setPopularVideos(popularData);

        // Create featured videos for carousel (first 5 popular videos)
        if (popularData.length > 0) {
          const carouselVideos = popularResponse.data
            .slice(0, 5)
            .map((video, index) => {
              // Extract YouTube video ID if available
              const videoUrl = video.url || video.videoUrl;
              let thumbnailUrl = videoUrl;

              // Try to extract YouTube video ID for better thumbnails
              const videoId = getYouTubeVideoId(videoUrl);
              if (videoId) {
                thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }

              return {
                id: video.id,
                title: video.title,
                thumbnail: thumbnailUrl,
                likes: Math.floor(Math.random() * 5000) + 500,
                badge: index === 0 ? "Top Pick" : "",
              };
            });

          setFeaturedVideos(carouselVideos);
        }

        // Create categories based on competitions
        const competitionsResponse = await axios.get(
          `${ENV.VITE_APP_API_URL}/competitions`
        );
        const categoryData = competitionsResponse.data.map((comp, index) => ({
          id: comp.id,
          name: comp.title,
          image: `https://source.unsplash.com/random/300x200?sig=${index}`, // Placeholder images
        }));

        // Add predefined categories with imported images
        const predefinedCategories = [
          {
            id: "trending",
            name: "Trending",
            image: trendingImage,
          },
          {
            id: "recent",
            name: "Most Recent",
            image: mostRecentImage,
          },
          {
            id: "comedy",
            name: "Comedy",
            image: comedyImage,
          },
          {
            id: "tech",
            name: "Tech",
            image: techImage,
          },
        ];

        setCategories(predefinedCategories);

        // Create feed videos
        const feedData = popularResponse.data.slice(0, 5).map((video) => {
          // Extract YouTube video ID if available
          const videoUrl = video.url || video.videoUrl;
          let thumbnailUrl = videoUrl;

          // Try to extract YouTube video ID for better thumbnails
          const videoId = getYouTubeVideoId(videoUrl);
          if (videoId) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }

          return {
            id: video.id,
            title: video.title,
            thumbnail: videoUrl, // Use the original URL for VideoCardDetailed's own extraction
            likes: Math.floor(Math.random() * 1000) + 100,
            username:
              video.creator?.username ||
              video.createdBy?.replace(/\s+/g, "") ||
              "user",
            userAvatar: userAvatar,
            createdAt: video.createdOn || new Date().toISOString(),
            isLiked: false,
            isDisliked: false,
          };
        });

        setFeedVideos(feedData);

        // Transform popular videos for SubmissionsSection format
        setLoadingTopVideos(true);
        const topVideosData = popularResponse.data.slice(0, 8).map((video) => {
          // Extract YouTube video ID if available
          const videoUrl = video.url || video.videoUrl;
          let thumbnailUrl = videoUrl;

          // Try to extract YouTube video ID for better thumbnails
          const videoId = getYouTubeVideoId(videoUrl);
          if (videoId) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }

          return {
            id: video.id,
            image: thumbnailUrl,
            title: video.title,
            views: String(Math.floor(Math.random() * 10000) + 1000), // Placeholder for views
          };
        });

        setTopVideos(topVideosData);
        setLoadingTopVideos(false);
      } catch (error) {
        console.error("Error fetching data for user home:", error);
        setLoadingTopVideos(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    try {
      // Handle different YouTube URL formats
      if (url.includes("youtube.com/watch")) {
        // Format: https://www.youtube.com/watch?v=VIDEO_ID
        const urlParams = new URLSearchParams(url.split("?")[1]);
        return urlParams.get("v");
      } else if (url.includes("youtu.be")) {
        // Format: https://youtu.be/VIDEO_ID
        return url.split("/").pop();
      } else if (url.includes("youtube.com/embed")) {
        // Format: https://www.youtube.com/embed/VIDEO_ID
        return url.split("/").pop().split("?")[0];
      }
    } catch (error) {
      console.error("Error extracting YouTube video ID:", error);
      return null;
    }

    return null;
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Implement search functionality here
  };

  const handleAdd = () => {
    navigate("/uploadVideo");
  };

  // Handlers for VideoCardDetailed component
  const handleVideoClick = (videoId) => {
    navigate(`/videos/${videoId}`);
  };

  const handleLike = (videoId, isLiked) => {
    console.log(`${isLiked ? "Unlike" : "Like"} video ${videoId}`);
    // Update like status in state
    setFeedVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              isLiked: !isLiked,
              likes: isLiked ? video.likes - 1 : video.likes + 1,
              isDisliked: isLiked ? video.isDisliked : false,
            }
          : video
      )
    );
  };

  const handleDislike = (videoId, isDisliked) => {
    console.log(
      `${isDisliked ? "Remove dislike from" : "Dislike"} video ${videoId}`
    );
    // Update dislike status in state
    setFeedVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              isDisliked: !isDisliked,
              isLiked: isDisliked ? video.isLiked : false,
            }
          : video
      )
    );
  };

  const handleShortlist = (videoId) => {
    console.log(`Toggle shortlist for video ${videoId}`);
    // Implement shortlist functionality
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Header
        title="Home"
        showSearch={true}
        showAdd={true}
        showMenu={true}
        onSearch={handleSearch}
        onAdd={handleAdd}
      />
      <div className={styles.content}>
        <SubmissionsSection
          title="Most Upvoted Videos"
          submissions={topVideos}
          loading={loadingTopVideos}
          viewAllLink="/videos?tag=popular"
          emptyMessage="No videos available"
        />

        <CategoryGrid
          title="Quick Filters"
          categories={categories}
          viewAllLink="/categories"
        />

        <VideoCarousel
          title="Featured Videos"
          videos={featuredVideos}
          viewAllLink="/videos?tag=featured"
        />

        <div className={styles.feed}>
          {feedVideos.map((video) => (
            <VideoCardDetailed
              key={video.id}
              video={video}
              onVideoClick={handleVideoClick}
              onLike={handleLike}
              onDislike={handleDislike}
              onShortlist={handleShortlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHome;

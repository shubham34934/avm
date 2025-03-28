import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserHome.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import VideoCarousel from "../../components/VideoCarousel/VideoCarousel";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import FeaturedVideo from "../../components/FeaturedVideo/FeaturedVideo";
import VideoPost from "../../components/VideoPost/VideoPost";
import Header from "../../components/Header/Header";
import { ENV } from "../../config/env";
import axios from "axios";

const UserHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popularVideos, setPopularVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [feedVideos, setFeedVideos] = useState([]);

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
        const popularData = popularResponse.data.content.map((video) => ({
          id: video.id,
          title: video.title,
          thumbnail: video.url,
          likes: Math.floor(Math.random() * 5000) + 500, // Placeholder for likes
        }));

        setPopularVideos(popularData);

        // Set featured video (first popular video)
        if (popularData.length > 0) {
          setFeaturedVideo({
            ...popularData[0],
            badge: "Top Pick",
          });
        }

        // Create categories based on competitions
        const competitionsResponse = await axios.get(
          `${ENV.VITE_APP_API_URL}/competitions`
        );
        const categoryData = competitionsResponse.data.content.map(
          (comp, index) => ({
            id: comp.id,
            name: comp.title,
            image: `https://source.unsplash.com/random/300x200?sig=${index}`, // Placeholder images
          })
        );

        // Add some predefined categories
        const predefinedCategories = [
          {
            id: "trending",
            name: "Trending",
            image: "https://source.unsplash.com/random/300x200?group",
          },
          {
            id: "recent",
            name: "Most Recent",
            image: "https://source.unsplash.com/random/300x200?collage",
          },
          {
            id: "comedy",
            name: "Comedy",
            image: "https://source.unsplash.com/random/300x200?stage",
          },
          {
            id: "tech",
            name: "Tech",
            image: "https://source.unsplash.com/random/300x200?code",
          },
        ];

        setCategories(predefinedCategories);

        // Create feed videos
        const feedData = popularResponse.data.content
          .slice(0, 5)
          .map((video) => ({
            id: video.id,
            title: video.title,
            thumbnail: video.url,
            likes: Math.floor(Math.random() * 1000) + 100,
            comments: Math.floor(Math.random() * 50) + 5,
            username: video.creator?.username || "@" + video.createdBy,
            userAvatar: "https://source.unsplash.com/random/100x100?face",
            createdAt: video.createdOn || new Date().toISOString(),
          }));

        setFeedVideos(feedData);
      } catch (error) {
        console.error("Error fetching data for user home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Implement search functionality here
  };

  const handleAdd = () => {
    navigate("/uploadVideo");
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
        <VideoCarousel
          title="Most Upvoted Videos"
          videos={popularVideos}
          viewAllLink="/popular"
        />

        <CategoryGrid
          title="Quick Filters"
          categories={categories}
          viewAllLink="/categories"
        />

        {featuredVideo && <FeaturedVideo video={featuredVideo} />}

        <div className={styles.feed}>
          {feedVideos.map((post) => (
            <VideoPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHome;

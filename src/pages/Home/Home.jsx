import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { fetchCompetitions } from "../../reducers/competitions";
import { fetchVideoPosts } from "../../reducers/videoPosts";
import { usePermissions } from "../../hooks/usePermissions";
import { generateVideoTags } from "../../utils/videoUtils";

// Components
import Header from "../../components/Header/Header";
import StatsCard from "../../components/Stats/StatsCard";
import CampaignCard from "../../components/CampaignCard/CampaignCard";
import VideoCard from "../../components/VideoCard/VideoCard";
import Loader from "../../components/Loader/Loader";
import VideoCarousel from "../../components/VideoCarousel/VideoCarousel";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import SubmissionsSection from "../../components/SubmissionsSection/SubmissionsSection";
import VideoCardDetailed from "../../components/VideoCardDetailed/VideoCardDetailed";
import Tag from "../../components/Tag/Tag";

// Styles and assets
import styles from "./Home.module.css";
import { useLayout } from "../../context/LayoutContext";
import brandLogo from "./../../assets/images/brand.png";
import campaignIcon from "./../../assets/icons/campaign.svg";
import videosIcon from "./../../assets/icons/videos.svg";
import userAvatar from "../../assets/images/users/1.png";

// Import the category images
import trendingImage from "../../assets/images/homepage/trending.png";
import mostRecentImage from "../../assets/images/homepage/mostRecent.png";
import comedyImage from "../../assets/images/homepage/comedy.png";
import techImage from "../../assets/images/homepage/tech.png";
import axios from "axios";
import { ENV } from "../../config/env";
import { USER_TYPE_DISPLAY, USER_ROLES } from "../../utils/constants";

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toggleSidebar } = useLayout();

  // Get permissions from our custom hook
  const {
    userRole,
    canViewStats,
    canViewLiveCampaigns,
    canViewVideosUploaded,
    canViewMostUpvoted,
    canViewCategoryGrid,
    canViewVideoCarousel,
    canViewFeedVideos,
  } = usePermissions();

  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularVideos, setPopularVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [feedVideos, setFeedVideos] = useState([]);
  const [topVideos, setTopVideos] = useState([]);
  const [loadingTopVideos, setLoadingTopVideos] = useState(true);

  // Get competitions and video posts from the store
  const { competitions } = useAppSelector((state) => state.competitions);
  const { videoPosts } = useAppSelector((state) => state.videoPosts);

  // Fetch campaigns and video posts on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch campaigns for the homepage
        await dispatch(fetchCompetitions({ page: 0, size: 10 })).unwrap();

        // Fetch video posts for the homepage
        await dispatch(fetchVideoPosts({ page: 0, size: 10 })).unwrap();

        // Only fetch user-specific data if needed
        if (canViewMostUpvoted || canViewVideoCarousel || canViewFeedVideos) {
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
          const topVideosData = popularResponse.data
            .slice(0, 8)
            .map((video) => {
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
        }
      } catch (error) {
        console.error("Error fetching data for homepage:", error);
        setError("Failed to load data. Please try again later.");
        setLoadingTopVideos(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, canViewMostUpvoted, canViewVideoCarousel, canViewFeedVideos]);

  // Calculate stats based on the data we have
  const liveCount = competitions.filter(
    (c) => c.status === "ACTIVE" || c.status === "Active"
  ).length;

  const completeCount = competitions.filter(
    (c) => c.status === "COMPLETED" || c.status === "Completed"
  ).length;

  const stats = [
    { title: "Live", value: liveCount },
    { title: "Complete", value: completeCount },
    { title: "Submission", value: videoPosts.length },
  ];

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
      } else if (url.includes("youtube.com/shorts")) {
        // Format: https://www.youtube.com/shorts/VIDEO_ID
        return url.split("/shorts/")[1]?.split("?")[0];
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

  // Determine the appropriate header title based on user role
  const headerTitle = [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(
    userRole
  )
    ? USER_TYPE_DISPLAY[userRole] || userRole
    : "Home";

  // Determine if we should show search and add buttons based on role
  const showSearch = [USER_ROLES.USER, USER_ROLES.CREATOR].includes(userRole);
  const showAdd = [USER_ROLES.CREATOR].includes(userRole);
  const isCreator = userRole === USER_ROLES.CREATOR;

  return (
    <div className={styles.container}>
      <Header
        title={headerTitle}
        showMenu
        onMenu={toggleSidebar}
        showSearch={showSearch}
        showAdd={showAdd}
        onSearch={handleSearch}
        onAdd={handleAdd}
        showMore={false}
      />

      {/* Welcome section with role badge */}
      <div className={styles.welcome}>
        <h1>Welcome Back, {user.firstName}</h1>
        {
          <Tag
            text={USER_TYPE_DISPLAY[userRole] || userRole}
            variant={"accent"}
            size="small"
            style={{ whiteSpace: "nowrap" }}
          />
        }
      </div>

      {/* Stats section - visible to Admin and Super Admin */}
      {canViewStats && (
        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className={styles.statsCard}
              onClick={() => {
                if (stat.title === "Live") {
                  navigate("/campaign?status=active");
                } else if (stat.title === "Complete") {
                  navigate("/campaign?status=completed");
                } else if (stat.title === "Submission") {
                  navigate("/videos");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <StatsCard
                title={stat.title}
                value={stat.value}
                variant={index === 0 ? "primary" : "default"}
              />
            </div>
          ))}
        </div>
      )}

      {/* Most Upvoted Videos - visible to User and Creator */}
      {canViewMostUpvoted && (
        <div style={{ marginBottom: "10px" }}>
          <SubmissionsSection
            title="Most Upvoted Videos"
            submissions={topVideos}
            loading={loadingTopVideos}
            viewAllLink="/videos?tag=popular"
            emptyMessage="No videos available"
          />
        </div>
      )}

      {/* Live Campaigns section - visible to Creator, Admin, Super Admin */}
      {canViewLiveCampaigns && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <img
                className={styles.sectionIcon}
                src={campaignIcon}
                alt="Live campaign"
              />
              <h2>Live Campaigns</h2>
            </div>
            <button
              className={styles.viewAll}
              onClick={() => {
                navigate("/campaign");
              }}
            >
              View all
            </button>
          </div>
          <div className={styles.campaigns}>
            {loading ? (
              <Loader />
            ) : error ? (
              <p className={styles.errorMessage}>{error}</p>
            ) : competitions.length === 0 ? (
              <p className={styles.emptyMessage}>No campaigns available.</p>
            ) : (
              competitions.slice(0, 2).map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  name={campaign.title}
                  startDate={new Date(campaign.startDate).toLocaleDateString(
                    "en-US",
                    {
                      day: "2-digit",
                      month: "short",
                    }
                  )}
                  endDate={new Date(campaign.endDate).toLocaleDateString(
                    "en-US",
                    {
                      day: "2-digit",
                      month: "short",
                    }
                  )}
                  amount={campaign.totalPrizeValue}
                  actionText={isCreator ? "Submit Video" : null}
                  status={campaign.status}
                  brandName={campaign.sponsor?.name || "Brand Name"}
                  brandLogo={campaign.sponsor?.logo || brandLogo}
                  onClick={() => navigate(`/campaign/${campaign.id}`)}
                />
              ))
            )}
          </div>
        </section>
      )}

      {/* Videos Uploaded section - visible to Creator, Admin, Super Admin */}
      {canViewVideosUploaded && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <img
                className={styles.sectionIcon}
                src={videosIcon}
                alt="Videos"
                style={{ width: "24px" }}
              />
              <h2>Videos Uploaded</h2>
            </div>
            <button
              className={styles.viewAll}
              onClick={() => {
                navigate("/videos");
              }}
            >
              View all
            </button>
          </div>
          <div className={styles.videos}>
            {loading ? (
              <Loader />
            ) : error ? (
              <p className={styles.errorMessage}>{error}</p>
            ) : videoPosts.length === 0 ? (
              <p className={styles.emptyMessage}>No videos available.</p>
            ) : (
              videoPosts.slice(0, 5).map((video) => {
                console.log("Video object in Home:", video);
                const tags = generateVideoTags(video);
                console.log("Generated tags:", tags);
                return (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    campaignName={video.competition || "General Campaign"}
                    userName={video.updatedBy || "Anonymous"}
                    timestamp={
                      video.createdOn
                        ? new Date(video.createdOn).toLocaleDateString()
                        : "Recent"
                    }
                    status={video.status || "PUBLISHED"}
                    views={video.views || "0"}
                    thumbnail={video.url}
                    onClick={() => navigate(`/videos/${video.id}`)}
                    tags={tags}
                  />
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Category Grid/Quick Filters - visible to User and Creator */}
      {canViewCategoryGrid && (
        <CategoryGrid
          title="Quick Filters"
          categories={categories}
          viewAllLink="/categories"
        />
      )}

      {/* Video Carousel - visible to User and Creator */}
      {canViewVideoCarousel && (
        <VideoCarousel
          title="Featured Videos"
          videos={featuredVideos}
          viewAllLink="/videos?tag=featured"
        />
      )}

      {/* Feed Videos - visible to User and Creator */}
      {canViewFeedVideos && (
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
      )}
    </div>
  );
};

export default Home;

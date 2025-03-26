import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import {
  fetchSubmissions,
  fetchShortlistedSubmissions,
  toggleLike,
  toggleShortlist,
} from "../../reducers/submissions";
import { fetchVideoPosts } from "../../reducers/videoPosts";
import styles from "./Videos.module.css";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import VideoCardDetailed from "../../components/VideoCardDetailed/VideoCardDetailed";
import VideoCard from "../../components/VideoCard/VideoCard";

// Dummy data for fallback
const dummySubmissions = [
  {
    id: 1,
    title: "Mountain Adventure Shorts",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", // Thumbnail from a YouTube video
    videoUrl: "https://youtube.com/shorts/dQw4w9WgXcQ",
    username: "@adventurer",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    likes: 42,
    isLiked: false,
    isDisliked: false,
    isShortlisted: false,
    userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    title: "City Lights Vlog Shorts",
    thumbnail: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg", // Thumbnail from another YouTube video
    videoUrl: "https://youtube.com/shorts/3JZ_D3ELwOQ",
    username: "@urbanexplorer",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    likes: 78,
    isLiked: false,
    isDisliked: false,
    isShortlisted: false,
    userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    title: "Cooking Masterclass Shorts",
    thumbnail: "https://i.ytimg.com/vi/tJfDBSWYqU8/hqdefault.jpg", // Thumbnail from another YouTube video
    videoUrl: "https://youtube.com/shorts/tJfDBSWYqU8",
    username: "@cheflife",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    likes: 105,
    isLiked: false,
    isDisliked: false,
    isShortlisted: false,
    userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const Submissions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id: campaignId } = useParams();
  const location = useLocation();

  // Check if it's a submissions page or a videos page
  const isSubmission =
    new URLSearchParams(location.search).get("isSubmission") === "true";

  // Check if the video cards should be detailed or simple
  const isDetailed =
    new URLSearchParams(location.search).get("isDetailed") === "true";

  const [activeTab, setActiveTab] = useState("submissions");
  const {
    submissions,
    shortlistedSubmissions,
    loading: submissionsLoading,
    error: submissionsError,
  } = useAppSelector((state) => state.submissions);

  // New state for video posts
  const {
    videoPosts,
    loading: videoPostsLoading,
    error: videoPostsError,
  } = useAppSelector((state) => state.videoPosts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSubmission) {
          if (activeTab === "submissions") {
            await dispatch(
              fetchSubmissions({ campaignId: parseInt(campaignId) })
            ).unwrap();
          } else {
            await dispatch(
              fetchShortlistedSubmissions({ campaignId: parseInt(campaignId) })
            ).unwrap();
          }
        } else {
          // Fetch video posts when it's not a submission page
          await dispatch(fetchVideoPosts()).unwrap();
        }
      } catch (error) {
        // toast.error(error.message || 'Failed to fetch data');
      }
    };

    fetchData();
  }, [dispatch, campaignId, activeTab, isSubmission]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = (query) => {
    // Handle search
    console.log("Search:", query);
  };

  const handleAdd = () => {
    // Handle add
    console.log("Add clicked");
  };

  const handleMore = () => {
    // Handle more options
    console.log("More clicked");
  };

  const handleLike = async (submissionId, isCurrentlyLiked) => {
    try {
      await dispatch(
        toggleLike({ submissionId, isLike: !isCurrentlyLiked })
      ).unwrap();
    } catch (error) {
      // toast.error("Failed to update like status");
    }
  };

  const handleDislike = async (submissionId, isCurrentlyDisliked) => {
    try {
      await dispatch(toggleLike({ submissionId, isLike: false })).unwrap();
    } catch (error) {
      // toast.error("Failed to update dislike status");
    }
  };

  const handleVideoClick = (submissionId) => {
    const submission = displayedSubmissions.find((s) => s.id === submissionId);
    if (submission && submission.videoUrl) {
      window.open(submission.videoUrl, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/videos/${submissionId}`);
    }
  };

  const handleShortlist = async (submissionId) => {
    try {
      await dispatch(toggleShortlist(submissionId)).unwrap();
      toast.success("Submission shortlist status updated");
    } catch (error) {
      // toast.error("Failed to update shortlist status");
    }
  };

  // Determine which submissions to display
  const displayedSubmissions = isSubmission
    ? submissionsError
      ? dummySubmissions
      : activeTab === "submissions"
      ? submissions
      : shortlistedSubmissions
    : videoPosts.map((videoPost) => ({
        id: videoPost.id,
        title: videoPost.title,
        thumbnail: videoPost.url, // Assuming url can be used as thumbnail
        videoUrl: videoPost.url,
        username: videoPost.createdBy,
        createdAt: videoPost.createdOn,
        likes: 0, // No likes information in the API
        isLiked: false,
        isDisliked: false,
        isShortlisted: false,
        userAvatar: null,
      }));

  if (isSubmission ? submissionsLoading : videoPostsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Header
        title={isSubmission ? "Submissions Video" : "Videos"}
        showBack
        onBack={handleBack}
        showSearch
        onSearch={handleSearch}
        showAdd={false}
        onAdd={handleAdd}
        showMore
        onMore={handleMore}
      />

      {isSubmission && (
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "submissions" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "shortlisted" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("shortlisted")}
          >
            Shortlisted
          </button>
        </div>
      )}

      <div className={styles.videoList}>
        {displayedSubmissions.map((video) =>
          isDetailed ? (
            <VideoCardDetailed
              key={video.id}
              video={video}
              onVideoClick={handleVideoClick}
              onLike={handleLike}
              onDislike={handleDislike}
              onShortlist={handleShortlist}
            />
          ) : (
            <VideoCard
              key={video.id}
              title={video.title}
              campaignName="Campaign Name" // You might want to pass the actual campaign name
              userName={video.username}
              timestamp={new Date(video.createdAt).toLocaleDateString()}
              status={video.isShortlisted ? "Shortlisted" : "Pending"}
              thumbnail={video.thumbnail}
              onClick={() => handleVideoClick(video.id)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Submissions;

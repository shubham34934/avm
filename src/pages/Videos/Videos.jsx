import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { toggleLike, toggleShortlist } from "../../reducers/submissions";
import { fetchVideoPosts, deleteVideoPost } from "../../reducers/videoPosts";
import InfiniteLoader from "../../components/InfiniteLoader/InfiniteLoader";
import styles from "./Videos.module.css";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import VideoCardDetailed from "../../components/VideoCardDetailed/VideoCardDetailed";
import VideoCard from "../../components/VideoCard/VideoCard";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import Footer from "../../components/Footer/Footer";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { setVideoList } from "../../reducers/videoNavigation";

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Submissions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Check if it's a submissions page or a videos page
  const isSubmission =
    new URLSearchParams(location.search).get("isSubmission") === "true";
  const campaignId = new URLSearchParams(location.search).get("campaignId");

  // Check if the video cards should be detailed or simple
  const isDetailed =
    new URLSearchParams(location.search).get("isDetailed") === "true";

  console.log({ isDetailed, isSubmission, campaignId });
  const [activeTab, setActiveTab] = useState("submissions");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [videoToDelete, setVideoToDelete] = useState(null);

  // Use video posts state for both submissions and video posts
  const {
    videoPosts,
    loading: videoPostsLoading,
    error: videoPostsError,
    totalItems,
  } = useAppSelector((state) => state.videoPosts);

  // Ref to track if initial load has happened
  const isInitialLoadRef = useRef(true);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query) => {
      // Ensure the search query is preserved
      setSearchQuery(query);
      setIsSearching(true);

      // Reset page to 0 when searching
      setCurrentPage(0);

      // Determine filters based on submission or video posts
      const filters = {
        page: 0,
        size: 10,
        sort: "createdOn,desc",
        ...(isSubmission && campaignId
          ? { competition: { id: parseInt(campaignId) } }
          : {}),
        ...(query ? { searchQuery: query } : {}),
      };

      console.log("Searching with filters:", filters);

      dispatch(fetchVideoPosts(filters))
        .then((response) => {
          console.log("Search response:", response);
          setIsSearching(false);
        })
        .catch((error) => {
          console.error("Search error:", error);
          toast.error("Failed to perform search");
          setIsSearching(false);
        });
    }, 500), // 500ms debounce delay
    [dispatch, isSubmission, campaignId]
  );

  // Handler for search from Header
  const handleSearch = useCallback(
    (query) => {
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const handleLoadMore = useCallback(() => {
    // Determine filters based on submission or video posts
    const filters = {
      page: currentPage + 1,
      size: 10,
      sort: "createdOn,desc",
      ...(isSubmission && campaignId
        ? { competition: { id: parseInt(campaignId) } }
        : {}),
      ...(searchQuery ? { searchQuery } : {}),
    };

    console.log("Fetching next page with filters:", filters);

    dispatch(fetchVideoPosts(filters))
      .then((response) => {
        // Always increment page, regardless of response
        setCurrentPage((prev) => {
          console.log("Page updated from", prev, "to", prev + 1);
          return prev + 1;
        });

        // Log the response for debugging
        console.log("Fetch video posts response:", response);
      })
      .catch((error) => {
        console.error("Error fetching next page:", error);
        toast.error("Failed to load more items");
      });
  }, [dispatch, isSubmission, campaignId, searchQuery, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Determine filters based on submission or video posts
        const filters = {
          page: 0,
          size: 10,
          sort: "createdOn,desc",
          ...(isSubmission && campaignId
            ? { competition: { id: parseInt(campaignId) } }
            : {}),
          ...(searchQuery ? { searchQuery } : {}),
        };

        console.log("Initial fetch with filters:", filters);

        await dispatch(fetchVideoPosts(filters)).unwrap();

        // Reset initial load ref
        isInitialLoadRef.current = false;
      } catch (error) {
        console.error("Initial fetch error:", error);
        toast.error(error.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [campaignId, activeTab, isSubmission, searchQuery]);

  const handleBack = () => {
    navigate(-1);
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
      toast.error("Failed to update like status");
    }
  };

  const handleDislike = async (submissionId, isCurrentlyDisliked) => {
    try {
      await dispatch(toggleLike({ submissionId, isLike: false })).unwrap();
    } catch (error) {
      toast.error("Failed to update dislike status");
    }
  };

  const handleVideoClick = (submissionId) => {
    // Find the index of the clicked video
    const clickedVideoIndex = videoPosts.findIndex(
      (video) => video.id === submissionId
    );

    // Dispatch action to set video list for navigation
    dispatch(
      setVideoList({
        videos: videoPosts,
        initialIndex: clickedVideoIndex,
        context: {
          isSubmission,
          campaignId,
          searchQuery,
        },
      })
    );

    // Navigate to the video player
    navigate(`/videos/${submissionId}`);
  };

  const handleShortlist = async (submissionId) => {
    try {
      await dispatch(toggleShortlist(submissionId)).unwrap();
      toast.success("Submission shortlist status updated");
    } catch (error) {
      toast.error("Failed to update shortlist status");
    }
  };

  const handleEdit = (videoId) => {
    console.log("Edit video", videoId);
    // Navigate to edit page with edit flag
    navigate(`/uploadVideo/${videoId}?edit=true`);
  };

  const handleDelete = (videoId) => {
    // Find the video to delete
    const videoToDelete = videoPosts.find((video) => video.id === videoId);
    if (videoToDelete) {
      setVideoToDelete(videoToDelete);
    }
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;
    try {
      // Call the delete API through the reducer
      await dispatch(deleteVideoPost(videoToDelete.id)).unwrap();
      toast.success(`Video "${videoToDelete.title}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error(
        `Failed to delete video: ${error?.message || "Unknown error"}`
      );
      // If API call fails, refresh the video list to ensure UI is in sync with backend
      dispatch(fetchVideoPosts());
    } finally {
      setVideoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setVideoToDelete(null);
  };

  const handleView = (videoId) => {
    console.log("View video", videoId);
    // Navigate to video player
    handleVideoClick(videoId);
  };

  const handleMenuClick = (videoId, e) => {
    e.stopPropagation();
    // Get the position of the clicked button for popover positioning
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: buttonRect.bottom,
      left: buttonRect.right - 120, // Adjust to position the popover correctly
    });
    // Toggle menu - close if already open, open if closed
    setActiveMenuId(activeMenuId === videoId ? null : videoId);
  };

  const handleCloseMenu = () => {
    setActiveMenuId(null);
  };

  // Determine which submissions to display
  const displayedSubmissions = videoPostsError
    ? []
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

  console.log({ activeTab });

  return (
    <div className={styles.container}>
      <Header
        title={isSubmission ? "Submissions Video" : "Videos"}
        showBack
        onBack={handleBack}
        showSearch
        onSearch={handleSearch}
        searchQuery={searchQuery}
        showAdd={false}
        onAdd={handleAdd}
        showMore
        onMore={handleMore}
      />

      {isSearching && (
        <div className={styles.searchingOverlay}>
          <div className={styles.searchingSpinner}>Searching...</div>
        </div>
      )}

      {isSubmission && (
        <div className={styles.tabs}>
          <button
            className={
              activeTab === "submissions" ? styles.activeTab : styles.tab
            }
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
          <button
            className={
              activeTab === "shortlisted" ? styles.activeTab : styles.tab
            }
            onClick={() => setActiveTab("shortlisted")}
          >
            Shortlisted
          </button>
        </div>
      )}
      {videoPostsLoading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <InfiniteLoader
          onLoadMore={handleLoadMore}
          hasMore={true}
          isLoading={videoPostsLoading}
          threshold={0.1}
          loader={
            <div>Loading more {isSubmission ? "submissions" : "videos"}...</div>
          }
        >
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
                  campaignName="Campaign Name"
                  userName={video.username}
                  timestamp={new Date(video.createdAt).toLocaleDateString()}
                  status={video.isShortlisted ? "Shortlisted" : "Pending"}
                  thumbnail={video.thumbnail}
                  onClick={() => handleVideoClick(video.id)}
                  onEdit={() => handleEdit(video.id)}
                  onDelete={() => handleDelete(video.id)}
                  onView={() => handleView(video.id)}
                  showMenu={activeMenuId === video.id}
                  onMenuClick={(e) => handleMenuClick(video.id, e)}
                  onCloseMenu={handleCloseMenu}
                />
              )
            )}
          </div>
          <FloatingActionButton />
        </InfiniteLoader>
      )}
      {activeMenuId && (
        <div
          className={styles.globalPopover}
          style={{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
          }}
        >
          <div className={styles.menuOptions}>
            <button
              className={styles.menuOption}
              onClick={() => {
                const videoId = activeMenuId;
                setActiveMenuId(null);
                handleView(videoId);
              }}
            >
              View
            </button>
            <button
              className={styles.menuOption}
              onClick={() => {
                const videoId = activeMenuId;
                setActiveMenuId(null);
                handleEdit(videoId);
              }}
            >
              Edit
            </button>
            <button
              className={`${styles.menuOption} ${styles.deleteOption}`}
              onClick={() => {
                const videoId = activeMenuId;
                setActiveMenuId(null);
                handleDelete(videoId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {videoToDelete && (
        <ConfirmationModal
          title="Delete Video"
          message={`Are you sure you want to delete the video "${videoToDelete.title}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
      <Footer />
    </div>
  );
};

export default Submissions;

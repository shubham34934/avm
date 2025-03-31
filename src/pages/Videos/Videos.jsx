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
import { usePermissions } from "../../hooks/usePermissions";
import { USER_ROLES } from "../../utils/constants";
import { generateVideoTags } from "../../utils/videoUtils";

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
  const queryParams = new URLSearchParams(location.search);
  const { userRole } = usePermissions();

  // Extract all query parameters
  const isSubmission = queryParams.get("isSubmission") === "true";
  const campaignId = queryParams.get("campaignId");
  const isDetailed = queryParams.get("isDetailed") === "true";
  const tag = queryParams.get("tag");

  // Determine if we should show detailed view based on user role
  // Creators and End Users (ROLE_CREATOR and ROLE_USER) should see detailed view
  const shouldShowDetailedView = 
    isDetailed || 
    userRole === USER_ROLES.CREATOR || 
    userRole === USER_ROLES.USER;

  const [activeTab, setActiveTab] = useState("submissions");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [videoToDelete, setVideoToDelete] = useState(null);

  // Ref for the popover element
  const popoverRef = useRef(null);

  // Effect to handle clicks outside the popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If activeMenuId is set and the click is outside the popover
      if (
        activeMenuId &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        // Make sure we're not clicking on the menu button itself
        !event.target.closest("[data-menu-button]")
      ) {
        setActiveMenuId(null);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId]);

  // Use video posts state for both submissions and video posts
  const {
    videoPosts,
    loading: videoPostsLoading,
    error: videoPostsError,
    totalItems,
  } = useAppSelector((state) => state.videoPosts);

  // Ref to track if initial load has happened
  const isInitialLoadRef = useRef(true);

  // Helper function to build API filters from URL parameters and other state
  const buildFilters = useCallback(
    (page = 0) => {
      const filters = {
        page,
        size: 10,
        sort: "createdOn,desc",
      };

      // Add competition filter if it's a submission page
      if (isSubmission && campaignId) {
        filters.competition = { id: parseInt(campaignId) };
      }

      // Add search query if available
      if (searchQuery) {
        filters.searchQuery = searchQuery;
      }

      // Add tag filter if available
      if (tag) {
        filters.tag = tag.toLowerCase();

        // Special handling for predefined tags
        if (tag.toLowerCase() === "popular") {
          filters.sort = "likes,desc";
        } else if (tag.toLowerCase() === "recent") {
          filters.sort = "createdOn,desc";
        }
      }

      return filters;
    },
    [isSubmission, campaignId, searchQuery, tag]
  );

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query) => {
      // Ensure the search query is preserved
      setSearchQuery(query);
      setIsSearching(true);

      // Reset page to 0 when searching
      setCurrentPage(0);

      // Get filters with search query
      const filters = buildFilters(0);
      if (query) {
        filters.searchQuery = query;
      }

      dispatch(fetchVideoPosts(filters))
        .then((response) => {
          setIsSearching(false);
        })
        .catch((error) => {
          toast.error("Failed to perform search");
          setIsSearching(false);
        });
    }, 500), // 500ms debounce delay
    [dispatch, buildFilters]
  );

  // Handler for search from Header
  const handleSearch = useCallback(
    (query) => {
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const handleLoadMore = useCallback(() => {
    // Get filters for next page
    const filters = buildFilters(currentPage + 1);
    dispatch(fetchVideoPosts(filters))
      .then((response) => {
        setCurrentPage((prev) => {
          return prev + 1;
        });
      })
      .catch((error) => {
        console.error("Error fetching next page:", error);
        toast.error("Failed to load more items");
      });
  }, [dispatch, buildFilters, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get initial filters
        const filters = buildFilters(0);
        await dispatch(fetchVideoPosts(filters)).unwrap();
        // Reset initial load ref
        isInitialLoadRef.current = false;
      } catch (error) {
        toast.error(error.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [
    dispatch,
    buildFilters,
    campaignId,
    activeTab,
    isSubmission,
    searchQuery,
    tag,
  ]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAdd = () => {
    // Handle add
  };

  const handleMore = () => {
    // Handle more options
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
          tag,
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
      dispatch(fetchVideoPosts(buildFilters(0)));
    } finally {
      setVideoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setVideoToDelete(null);
  };

  const handleView = (videoId) => {
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

  // Generate page title based on filters
  let pageTitle = isSubmission ? "Submissions Video" : "Videos";
  if (tag) {
    // Capitalize first letter of tag for display
    const displayTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
    pageTitle = `${displayTag} Videos`;
  }

  return (
    <div className={styles.container}>
      <Header
        title={pageTitle}
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
          <div
            className={`${styles.videoList} ${
              shouldShowDetailedView ? styles.detailedList : styles.gridList
            } ${isSubmission ? styles.submissionsList : styles.videosList}`}
          >
            {displayedSubmissions.map((video) =>
              shouldShowDetailedView ? (
                <VideoCardDetailed
                  key={video.id}
                  video={video}
                  onVideoClick={handleVideoClick}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onShortlist={handleShortlist}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
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
                  data-menu-button={`menu-${video.id}`}
                  tags={(() => {
                    console.log('Video object in Videos:', video);
                    const tags = generateVideoTags(video);
                    console.log('Generated tags in Videos:', tags);
                    return tags;
                  })()}
                />
              )
            )}
          </div>
          <FloatingActionButton />
        </InfiniteLoader>
      )}
      {activeMenuId && (
        <div
          ref={popoverRef}
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

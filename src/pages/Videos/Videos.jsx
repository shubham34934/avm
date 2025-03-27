import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { toggleLike, toggleShortlist } from "../../reducers/submissions";
import { fetchVideoPosts } from "../../reducers/videoPosts";
import InfiniteLoader from "../../components/InfiniteLoader/InfiniteLoader";
import styles from "./Videos.module.css";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import VideoCardDetailed from "../../components/VideoCardDetailed/VideoCardDetailed";
import VideoCard from "../../components/VideoCard/VideoCard";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";

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
      toast.error("Failed to update shortlist status");
    }
  };

  // Determine which submissions to display
  const displayedSubmissions = videoPostsError
    ? dummySubmissions
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
                />
              )
            )}
          </div>
          <FloatingActionButton />
        </InfiniteLoader>
      )}
    </div>
  );
};

export default Submissions;

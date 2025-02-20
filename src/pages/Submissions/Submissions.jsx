import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../config/store';
import { 
  fetchSubmissions, 
  fetchShortlistedSubmissions,
  toggleLike,
  toggleShortlist 
} from '../../reducers/submissions';
import styles from './Submissions.module.css';
import { LikeIcon, DislikeIcon, PlayIcon, MoreIcon } from '../../components/Icons/Icons';
import Header from '../../components/Header/Header';
import { toast } from 'react-toastify';

const Submissions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id: campaignId } = useParams();
  const [activeTab, setActiveTab] = useState('submissions');
  const { submissions, shortlistedSubmissions, loading, error } = useAppSelector(
    (state) => state.submissions
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'submissions') {
          await dispatch(fetchSubmissions({ campaignId: parseInt(campaignId) })).unwrap();
        } else {
          await dispatch(fetchShortlistedSubmissions({ campaignId: parseInt(campaignId) })).unwrap();
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch submissions');
      }
    };

    fetchData();
  }, [dispatch, campaignId, activeTab]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = (query) => {
    // Handle search
    console.log('Search:', query);
  };

  const handleAdd = () => {
    // Handle add
    console.log('Add clicked');
  };

  const handleMore = () => {
    // Handle more options
    console.log('More clicked');
  };

  const handleLike = async (submissionId, isCurrentlyLiked) => {
    try {
      await dispatch(toggleLike({ 
        submissionId, 
        isLike: !isCurrentlyLiked 
      })).unwrap();
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const handleDislike = async (submissionId, isCurrentlyDisliked) => {
    try {
      await dispatch(toggleLike({ 
        submissionId, 
        isLike: false 
      })).unwrap();
    } catch (error) {
      toast.error('Failed to update dislike status');
    }
  };

  const handleVideoClick = (submissionId) => {
    navigate(`/videos/${submissionId}`);
  };

  const handleShortlist = async (submissionId) => {
    try {
      await dispatch(toggleShortlist(submissionId)).unwrap();
      toast.success('Submission shortlist status updated');
    } catch (error) {
      toast.error('Failed to update shortlist status');
    }
  };

  const displayedSubmissions = activeTab === 'submissions' 
    ? submissions 
    : shortlistedSubmissions;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <Header 
        title="Submissions Video"
        showBack
        onBack={handleBack}
        showSearch
        onSearch={handleSearch}
        showAdd
        onAdd={handleAdd}
        showMore
        onMore={handleMore}
      />

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'submissions' ? styles.active : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          Submissions
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'shortlisted' ? styles.active : ''}`}
          onClick={() => setActiveTab('shortlisted')}
        >
          Shortlisted
        </button>
      </div>

      <div className={styles.videoList}>
        {displayedSubmissions.map(video => (
          <div key={video.id} className={styles.videoCard}>
            <div className={styles.userInfo}>
              <img 
                src={video.userAvatar || "/images/avatar.jpg"} 
                alt={video.username} 
                className={styles.avatar}
              />
              <div className={styles.userMeta}>
                <span className={styles.username}>{video.username}</span>
                <span className={styles.timeAgo}>
                  {new Date(video.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button 
                onClick={() => handleShortlist(video.id)} 
                className={styles.moreButton}
              >
                <MoreIcon />
              </button>
            </div>

            <h2 className={styles.videoTitle}>{video.title}</h2>

            <div 
              className={styles.thumbnail} 
              onClick={() => handleVideoClick(video.id)}
            >
              <img src={video.thumbnail} alt={video.title} />
              <div className={styles.playButton}>
                <PlayIcon />
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.likes}>
                <button 
                  onClick={() => handleLike(video.id, video.isLiked)}
                  className={`${styles.actionButton} ${video.isLiked ? styles.active : ''}`}
                >
                  <LikeIcon />
                  <span>{video.likes}</span>
                </button>
                <button 
                  onClick={() => handleDislike(video.id, video.isDisliked)}
                  className={`${styles.actionButton} ${video.isDisliked ? styles.active : ''}`}
                >
                  <DislikeIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submissions;

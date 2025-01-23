import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Submissions.module.css';
import { LikeIcon, DislikeIcon, PlayIcon, MoreIcon } from '../../components/Icons/Icons';
import Header from '../../components/Header/Header';

const videos = [
  {
    id: 1,
    title: 'Exploring the Mountains',
    thumbnail: '/images/mountains.jpg',
    username: '@username',
    timeAgo: '2 hours ago',
    likes: 950
  },
  {
    id: 2,
    title: 'City Life Vlog',
    thumbnail: '/images/city.jpg',
    username: '@username',
    timeAgo: '1 day ago',
    likes: 950
  },
  {
    id: 3,
    title: 'Cooking Masterclass',
    thumbnail: '/images/cooking.jpg',
    username: '@username',
    timeAgo: '3 days ago',
    likes: 950
  }
];

const Submissions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submissions');

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    // Handle search
  };

  const handleAdd = () => {
    // Handle add
  };

  const handleMore = () => {
    // Handle more options
  };

  const handleLike = (videoId) => {
    // Handle like
  };

  const handleDislike = (videoId) => {
    // Handle dislike
  };

  const handleVideoClick = (videoId) => {
    // Handle video click
  };

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
        {videos.map(video => (
          <div key={video.id} className={styles.videoCard}>
            <div className={styles.userInfo}>
              <img 
                src="/images/avatar.jpg" 
                alt={video.username} 
                className={styles.avatar}
              />
              <div className={styles.userMeta}>
                <span className={styles.username}>{video.username}</span>
                <span className={styles.timeAgo}>{video.timeAgo}</span>
              </div>
              <button onClick={handleMore} className={styles.moreButton}>
                <MoreIcon />
              </button>
            </div>

            <h2 className={styles.videoTitle}>{video.title}</h2>

            <div className={styles.thumbnail} onClick={() => handleVideoClick(video.id)}>
              <img src={video.thumbnail} alt={video.title} />
              <div className={styles.playButton}>
                <PlayIcon />
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.likes}>
                <button 
                  onClick={() => handleLike(video.id)}
                  className={styles.actionButton}
                >
                  <LikeIcon />
                  <span>{video.likes}</span>
                </button>
                <button 
                  onClick={() => handleDislike(video.id)}
                  className={styles.actionButton}
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

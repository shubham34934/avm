import styles from './UserTabs.module.css';

const VideosTab = ({ user }) => {
  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h3>Videos Upload</h3>
      </div>
      <div className={styles.videosGrid}>
        {user?.videos?.length > 0 ? (
          user.videos.map((video, index) => (
            <div key={index} className={styles.videoCard}>
              <div className={styles.videoThumbnail}>
                <img src={video.thumbnailUrl} alt={video.title} />
              </div>
              <div className={styles.videoInfo}>
                <h4>{video.title}</h4>
                <p>{video.description}</p>
                <div className={styles.videoStats}>
                  <span>Views: {video.views}</span>
                  <span>Likes: {video.likes}</span>
                  <span>Uploaded: {new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noVideos}>
            <p>No videos uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosTab; 
import { useState } from 'react';
import styles from './Videos.module.css';
import VideoCard from './VideoCard';
import defaultThumbnail from './../../assets/images/default-thumbnail.png';

const mockVideos = [
  {
    id: 1,
    title: 'Title',
    campaignName: 'Campaign Name',
    userName: '@user_name',
    timestamp: '15Aug 12:21pm',
    status: 'Pending',
    thumbnail: defaultThumbnail
  },
  {
    id: 2,
    title: 'Title',
    campaignName: 'Campaign Name',
    userName: '@user_name',
    timestamp: '15Aug 12:21pm',
    status: 'Pending',
    thumbnail: defaultThumbnail
  },
  {
    id: 3,
    title: 'Title',
    campaignName: 'Campaign Name',
    userName: '@user_name',
    timestamp: '15Aug 12:21pm',
    status: 'Pending',
    thumbnail: defaultThumbnail
  }
];

const Videos = () => {
  const [videos] = useState(mockVideos);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            {...video}
          />
        ))}
      </div>
    </div>
  );
};

export default Videos;

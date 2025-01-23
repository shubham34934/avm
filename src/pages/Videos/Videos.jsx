import { useState } from 'react';
import styles from './Videos.module.css';
import VideoCard from './../../components/VideoCard/VideoCard';
import defaultThumbnail from './../../assets/images/default-thumbnail.png';
import Header from '../../components/Header/Header';

const mockVideos = [
  {
    id: 1,
    title: 'Title',
    campaignName: 'Campaign Name',
    userName: '@user_name',
    timestamp: '15Aug 12:21pm',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Title',
    campaignName: 'Campaign Name',
    userName: '@user_name',
    timestamp: '15Aug 12:21pm',
    status: 'Pending',
  },
  {
    id: 3,
    title: 'Title',
    campaignName: 'Campaign Name',
    userName: '@user_name',
    timestamp: '15Aug 12:21pm',
    status: 'Pending',
  }
];

const Videos = () => {
  const [videos] = useState(mockVideos);

  return (
    <div className={styles.container}>
      <Header
        title="Campaigns"
        showSearch
        showAdd
        showMore
      />
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

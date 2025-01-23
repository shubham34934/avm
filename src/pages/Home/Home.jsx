import { useUser } from '../../hooks/useUser';
import StatsCard from '../../components/Stats/StatsCard';
import CampaignCard from '../../components/Campaign/CampaignCard';
import VideoCard from '../../components/VideoCard/VideoCard';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useUser();

  console.log({user})
  const stats = [
    { title: 'Live', value: 12 },
    { title: 'Complete', value: 123 },
    { title: 'Submission', value: 13689 },
  ];

  const campaigns = [
    {
      name: 'Summer Campaign',
      startDate: '2025-08-15',
      endDate: '2025-08-20',
      brand: {
        name: 'Brand Name',
        logo: '/brand-logo.png',
      },
      amount: 40000,
      status: 'In Progress',
    },
    // Add more campaigns as needed
  ];

  const videos = [
    {
      title: 'Product Review',
      campaign: 'Summer Campaign',
      username: 'user_name',
      timestamp: '2025-08-15T12:21:00',
      status: 'Pending',
      thumbnail: '/video-thumbnail.jpg',
    },
    // Add more videos as needed
  ];

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <h1>Welcome Back, {user.name}</h1>
        {user.role === 'Super Admin' && (
          <span className={styles.badge}>Super Admin</span>
        )}
      </div>

      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            variant={index === 0 ? 'primary' : 'default'}
          />
        ))}
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Campaigns</h2>
          <button className={styles.viewAll}>View all</button>
        </div>
        <div className={styles.campaigns}>
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.name} {...campaign} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Videos Uploaded</h2>
        </div>
        <div className={styles.videos}>
          {videos.map((video) => (
            <VideoCard
              key={video.title}
              {...video}
              onOptionsClick={() => {}}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

import { useUser } from '../../hooks/useUser';
import VideoCard from '../../components/VideoCard/VideoCard';
import styles from './Home.module.css';
import brandLogo from './../../assets/images/brand.png';
import Header from '../../components/Header/Header';
import { useLayout } from '../../context/LayoutContext';

const Home = () => {
  const { user } = useUser();
  const { toggleSidebar } = useLayout();

  const videos = [
    {
      id: 1,
      title: 'Video Title 1',
      thumbnail: brandLogo,
      views: 1200,
      likes: 45,
      createdAt: '2 days ago'
    },
    {
      id: 2,
      title: 'Video Title 2',
      thumbnail: brandLogo,
      views: 800,
      likes: 32,
      createdAt: '3 days ago'
    }
  ];

  const handleSearch = () => {
    // Handle search
  };

  const handleAdd = () => {
    // Handle add
  };

  const handleMore = () => {
    // Handle more options
  };

  return (
    <div className={styles.container}>
      <Header
        title="Super Admin"
        showMenu
        onMenu={toggleSidebar}
        showSearch
        onSearch={handleSearch}
        showAdd
        onAdd={handleAdd}
        showMore
        onMore={handleMore}
      />
      <div className={styles.welcome}>
        <h1>Welcome Back, {user.name}</h1>
        {user.role === 'Super Admin' && (
          <p>You have all access to the platform</p>
        )}
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Videos</h2>
          <button className={styles.viewAll}>View All</button>
        </div>
        <div className={styles.videoGrid}>
          {videos.map(video => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

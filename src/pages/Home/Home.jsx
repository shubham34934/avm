import { useUser } from '../../hooks/useUser';
import StatsCard from '../../components/Stats/StatsCard';
import CampaignCard from '../../components/CampaignCard/CampaignCard';
import VideoCard from '../../components/VideoCard/VideoCard';
import styles from './Home.module.css';
import brandLogo from './../../assets/images/brand.png';
import Header from '../../components/Header/Header';
import { useLayout } from '../../context/LayoutContext';
import Tag from '../../components/Tag/Tag';
import campaignIcon from './../../assets/icons/campaign.svg';
import videosIcon from './../../assets/icons/videos.svg';

import { useNavigate } from 'react-router-dom';
const Home = () => {
  const { user } = useUser();
  const navigate= useNavigate()
  const { toggleSidebar } = useLayout();

  const stats = [
    { title: 'Live', value: 12 },
    { title: 'Complete', value: 123 },
    { title: 'Submission', value: 13689 },
  ];

  const campaigns = [
    {
      name: 'Summer Campaign',
      startDate: '15 Aug',
      endDate: '20 Aug',
      brandName:'Brand Name',
      brandLogo:brandLogo,
      amount: 40000,
      status: 'In Progress',
    },
    {
      name: 'Summer Campaign',
      startDate: '15 Aug',
      endDate: '20 Aug',
      brandName:'Brand Name',
      brandLogo:brandLogo,
      amount: 40000,
    }
    // Add more campaigns as needed
  ];

  const videos = [
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
  ];

  return (
    <div className={styles.container}>
      <Header
        title="Super Admin"
        showMenu
        onMenu={toggleSidebar}
        showSearch={false}
        showAdd={false}
        showMore={false}
      />
      <div className={styles.welcome}>
        <h1>Welcome Back, {user.firstName}</h1>
        { <Tag text={"Super Admin"} variant={"accent"} size="small" style={{whiteSpace:"nowrap"}}/>}
        {/* {user.role === 'Super Admin' && (
          <span className={styles.badge}>Super Admin</span>
        )} */}
      </div>

      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={stat.title} className={styles.statsCard}>
            <StatsCard
            title={stat.title}
            value={stat.value}
            variant={index === 0 ? 'primary' : 'default'}
          />
          </div>
          
        ))}
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <img className={styles.sectionIcon} src={campaignIcon} alt="campaign"/>
            <h2>Campaigns</h2>
          </div>
          <button className={styles.viewAll} onClick={()=>{navigate("/campaign")}}>View all</button>
        </div>
        <div className={styles.campaigns}>
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.name} {...campaign} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
      <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <img className={styles.sectionIcon} src={videosIcon} alt="campaign" style={{width:"24px"}}/>
            <h2>Videos Uploaded</h2>
          </div>
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

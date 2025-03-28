import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import StatsCard from "../../components/Stats/StatsCard";
import CampaignCard from "../../components/CampaignCard/CampaignCard";
import VideoCard from "../../components/VideoCard/VideoCard";
import styles from "./Home.module.css";
import brandLogo from "./../../assets/images/brand.png";
import Header from "../../components/Header/Header";
import { useLayout } from "../../context/LayoutContext";
import Tag from "../../components/Tag/Tag";
import campaignIcon from "./../../assets/icons/campaign.svg";
import videosIcon from "./../../assets/icons/videos.svg";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { fetchCompetitions } from "../../reducers/competitions";
import { fetchVideoPosts } from "../../reducers/videoPosts";
import Loader from "../../components/Loader/Loader";

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toggleSidebar } = useLayout();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get competitions from the store
  const { competitions } = useAppSelector((state) => state.competitions);

  // Get video posts from the store
  const { videoPosts } = useAppSelector((state) => state.videoPosts);

  // Fetch campaigns and video posts on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch campaigns - limit to 2 for the homepage
        await dispatch(fetchCompetitions({ page: 0, size: 2 })).unwrap();

        // Fetch video posts - limit to 2 for the homepage
        await dispatch(fetchVideoPosts({ page: 0, size: 2 })).unwrap();
      } catch (error) {
        console.error("Error fetching data for homepage:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const stats = [
    { title: "Live", value: 12 },
    { title: "Complete", value: 123 },
    { title: "Submission", value: 13689 },
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
        {
          <Tag
            text={"Super Admin"}
            variant={"accent"}
            size="small"
            style={{ whiteSpace: "nowrap" }}
          />
        }
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
              variant={index === 0 ? "primary" : "default"}
            />
          </div>
        ))}
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <img
              className={styles.sectionIcon}
              src={campaignIcon}
              alt="campaign"
            />
            <h2>Campaigns</h2>
          </div>
          <button
            className={styles.viewAll}
            onClick={() => {
              navigate("/campaign");
            }}
          >
            View all
          </button>
        </div>
        <div className={styles.campaigns}>
          {loading ? (
            <Loader />
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : competitions.length === 0 ? (
            <p className={styles.emptyMessage}>No campaigns available.</p>
          ) : (
            competitions.slice(0, 2).map((campaign) => (
              <CampaignCard
                key={campaign.id}
                name={campaign.title}
                startDate={new Date(campaign.startDate).toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "short",
                  }
                )}
                endDate={new Date(campaign.endDate).toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "short",
                  }
                )}
                amount={campaign.totalPrizeValue}
                status={campaign.status}
                brandName={campaign.sponsor?.name || "Brand Name"}
                brandLogo={campaign.sponsor?.logo || brandLogo}
                onClick={() => navigate(`/campaign/${campaign.id}`)}
              />
            ))
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <img
              className={styles.sectionIcon}
              src={videosIcon}
              alt="campaign"
              style={{ width: "24px" }}
            />
            <h2>Videos Uploaded</h2>
          </div>
        </div>
        <div className={styles.videos}>
          {loading ? (
            <Loader />
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : videoPosts.length === 0 ? (
            <p className={styles.emptyMessage}>No videos available.</p>
          ) : (
            videoPosts.slice(0, 2).map((video) => (
              <VideoCard
                key={video.id}
                title={video.title}
                campaignName={video.competition?.title || "No Campaign"}
                userName={video.creator?.username || "@" + video.createdBy}
                timestamp={new Date(video.createdOn).toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
                status={video.isModerated ? "Approved" : "Pending"}
                thumbnail={video.url}
                onClick={() => navigate(`/videos/${video.id}`)}
                onOptionsClick={() => {}}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

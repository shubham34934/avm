import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CampaignDetails.module.css";
import Timeline from "../../components/Timeline/Timeline";
import SubmissionCard from "../../components/Submission/SubmissionCard";
import DateRange from "../../components/DateRange/DateRange";
import Header from "../../components/Header/Header";
import userAvatar from "./../../assets/images/users/1.png";
import MoreIcon from "./../../assets/icons/more.svg";
import thumbnail1 from "./../../assets/images/thumbnails/1.png";
import thumbnail2 from "./../../assets/images/thumbnails/2.png";
import thumbnail3 from "./../../assets/images/thumbnails/3.png";
import rightArrow from "./../../assets/icons/rightArrow.svg";

const CampaignDetails = () => {
  const navigate = useNavigate();
  const [timeLeft] = useState("1h 20m 34s");

  const timelineSteps = [
    {
      type: "campaign_created",
      title: "Campaign Created",
      timestamp: "12:21 July 12",
      isActive: true,
    },
    {
      type: "campaign_started",
      title: "Campaign Started",
      timestamp: "12:21 July 12",
      isActive: true,
    },
    {
      type: "completed",
      title: "Completed (12,498 submissions)",
      timestamp: "12:21 July 16",
      isActive: true,
      reminder: "Shortlist Reminder",
    },
    {
      type: "select_winners",
      title: "Select Winners",
      timestamp: "12:21 July 16",
      isActive: true,
      description: "12 Video shortlisted",
    },
    {
      type: "winner_announced",
      title: "Winner Announced",
      reminder: "Payout Reminder",
    },
    {
      type: "payment_sent",
      title: "Payment Sent",
    },
    {
      type: "done",
      title: "Remittance done",
    },
  ];

  const submissions = [
    {
      id: 1,
      image: thumbnail1,
      title: "Amazing Nature",
      views: "2.4M",
    },
    {
      id: 2,
      image: thumbnail2,
      title: "Tech Innovations",
      views: "2.8M",
    },
    {
      id: 3,
      image: thumbnail3,
      title: "Community",
      views: "1.5M",
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleMore = () => {
    // Handle more options
  };

  const campaignDetailsDescription =
    "Create compelling videos showcasing the product in everyday use. Top-performing videos will be rewarded and featured on our official channels.";

  const campaignDetailsPoints = [
    "Highlight the product benefits clearly.",
    "Keep the video length between 30 seconds and 1 minute.",
    "Use natural lighting and a clean background.",
    "Ensure the brand logo is visible in the video.",
    "Add captions or text overlays for clarity.",
    "Avoid offensive or inappropriate content.",
    "Submit videos in HD quality for best results.",
  ];

  return (
    <div className={styles.container}>
      <Header
        title="Summer Vibes Campaign"
        showBack
        onBack={handleBack}
        showSearch={false}
        showAdd={false}
        showMore
        onMore={handleMore}
      />

      <div className={styles.countdown}>
        <span>Start in {timeLeft}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <DateRange startDate="15Aug" endDate="20Aug" />
          <div className={styles.amount}>Rs 1,50,000.00</div>
        </div>

        <h2 className={styles.title}>About Campaign</h2>
        <div className={styles.points}>
          <p>{campaignDetailsDescription}</p>
          <ul>
            {campaignDetailsPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>

        <div className={styles.admin}>
          <img src={userAvatar} alt="Admin" className={styles.adminAvatar} />
          <div className={styles.adminInfo}>
            <h3>Admin_Name</h3>
            <p>Brand Admin</p>
          </div>
          <button onClick={handleMore} className={styles.moreButton}>
            <img src={MoreIcon} alt="More" />
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Submissions</h2>
            <button className={styles.viewAll}>
              <img src={rightArrow} alt="view all" />
            </button>
          </div>
          <div className={styles.submissionsList}>
            {submissions.map((submission) => (
              <SubmissionCard key={submission.id} {...submission} />
            ))}
          </div>
        </div>

        <Timeline steps={timelineSteps} />
      </div>
    </div>
  );
};

export default CampaignDetails;

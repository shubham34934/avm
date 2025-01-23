import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CampaignDetails.module.css';
import Timeline from '../../components/Timeline/Timeline';
import SubmissionCard from '../../components/Submission/SubmissionCard';
import DateRange from '../../components/DateRange/DateRange';
import Header from '../../components/Header/Header';
import userAvatar from "./../../assets/images/users/1.png";
import MoreIcon  from "./../../assets/icons/more.svg";
import thumbnail1 from "./../../assets/images/thumbnails/1.png";
import thumbnail2 from "./../../assets/images/thumbnails/2.png";
import thumbnail3 from "./../../assets/images/thumbnails/3.png";
import rightArrow  from "./../../assets/icons/rightArrow.svg";



const CampaignDetails = () => {
  const navigate = useNavigate();
  const [timeLeft] = useState('1h 20m 34s');

  const timelineItems = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      </svg>,
      label: 'Campaign Created',
      isCompleted: true,
      actions: <span className={styles.date}>12:21 July 12</span>
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      label: 'Campaign Started',
      isCompleted: true
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 7L12 15L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      label: 'Completed',
      isActive: true
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      </svg>,
      label: 'Select Winners'
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15L12 3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L3 19.5C3 20.0523 3.44772 20.5 4 20.5H20C20.5523 20.5 21 20.0523 21 19.5L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>,
      label: 'Winner Announced'
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 8.5H22M5 8.5V17C5 18.1046 5.89543 19 7 19H17C18.1046 19 19 18.1046 19 17V8.5M8 8.5V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>,
      label: 'Payment Sent'
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2"/>
      </svg>,
      label: 'Remittance done'
    }
  ];

  const submissions = [
    {
      id: 1,
      image: thumbnail1,
      title: 'Amazing Nature',
      views: '2.4M'
    },
    {
      id: 2,
      image: thumbnail2,
      title: 'Tech Innovations',
      views: '2.8M'
    },
    {
      id: 3,
      image: thumbnail3,
      title: 'Community',
      views: '1.5M'
    }
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleMore = () => {
    // Handle more options
  };

  const campaignDetailsDescription= "Create compelling videos showcasing the product in everyday use. Top-performing videos will be rewarded and featured on our official channels.";

  const campaignDetailsPoints = [
    "Highlight the product benefits clearly.",
    "Keep the video length between 30 seconds and 1 minute.",
    "Use natural lighting and a clean background.",
    "Ensure the brand logo is visible in the video.",
    "Add captions or text overlays for clarity.",
    "Avoid offensive or inappropriate content.",
    "Submit videos in HD quality for best results."
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
          <img src={MoreIcon} alt="More"  />
         
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Submissions</h2>
          <button className={styles.viewAll}>
            <img src={rightArrow} alt="view all"  />
          </button>
        </div>
        <div className={styles.submissionsList}>
          {submissions.map(submission => (
            <SubmissionCard
              key={submission.id}
              {...submission}
            />
          ))}
        </div>
      </div>

      <Timeline items={timelineItems} />
    </div>
  );
};

export default CampaignDetails;

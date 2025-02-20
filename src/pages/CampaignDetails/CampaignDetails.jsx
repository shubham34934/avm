import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { fetchCompetitionById } from "../../reducers/competitions";
import { fetchUserByUsername } from "../../reducers/users";
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
import { toast } from "react-toastify";

const CampaignDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const {
    selectedCompetition,
    loading: competitionLoading,
    error,
  } = useAppSelector((state) => state.competitions);
  const { selectedUser, loading: userLoading } = useAppSelector(
    (state) => state.users
  );
  const [timeLeft] = useState("1h 20m 34s");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const competitionResult = await dispatch(
          fetchCompetitionById(parseInt(id))
        ).unwrap();

        // Fetch user details if createdBy is available
        if (competitionResult.createdBy) {
          await dispatch(fetchUserByUsername(competitionResult.createdBy));
        }
      } catch (error) {
        toast.error(error || "Failed to fetch campaign details");
        navigate("/campaign");
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id, dispatch, navigate]);

  const timelineSteps = [
    {
      type: "campaign_created",
      title: "Campaign Created",
      timestamp: selectedCompetition?.createdDate || "",
      isActive: true,
    },
    {
      type: "campaign_started",
      title: "Campaign Started",
      timestamp: selectedCompetition?.startDate || "",
      isActive: selectedCompetition?.status === "ACTIVE",
    },
    {
      type: "completed",
      title: "Completed",
      timestamp: selectedCompetition?.endDate || "",
      isActive: selectedCompetition?.status === "COMPLETED",
    },
    {
      type: "select_winners",
      title: "Select Winners",
      isActive: selectedCompetition?.status === "WINNER_SELECTION",
    },
    {
      type: "winner_announced",
      title: "Winner Announced",
      isActive: selectedCompetition?.status === "WINNER_ANNOUNCED",
    },
    {
      type: "payment_sent",
      title: "Payment Sent",
      isActive: selectedCompetition?.paymentStatus === "PAID",
    },
    {
      type: "done",
      title: "Remittance done",
      isActive: selectedCompetition?.paymentStatus === "REMITTANCE_DONE",
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

  if (competitionLoading || userLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedCompetition) {
    return <div>No campaign found</div>;
  }

  const startDateFormatted = new Date(
    selectedCompetition.startDate
  ).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  const endDateFormatted = new Date(
    selectedCompetition.endDate
  ).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className={styles.container}>
      <Header
        title={selectedCompetition.title}
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
          <DateRange
            startDate={startDateFormatted}
            endDate={endDateFormatted}
          />
          <div className={styles.amount}>
            Rs {selectedCompetition.totalPrizeValue.toLocaleString()}
          </div>
        </div>

        <h2 className={styles.title}>About Campaign</h2>
        <div className={styles.points}>
          <p>{selectedCompetition.description}</p>
          {selectedCompetition.rules && (
            <ul>
              {selectedCompetition.rules.split("\n").map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.admin}>
          <img
            src={selectedUser?.imageUrl || userAvatar}
            alt="Admin"
            className={styles.adminAvatar}
          />
          <div className={styles.adminInfo}>
            <h3>
              {selectedUser
                ? `${selectedUser.firstName} ${selectedUser.lastName}`
                : selectedCompetition.createdBy || "Admin"}
            </h3>
            <p>
              {selectedUser?.email || selectedCompetition.createdBy || "Admin"}
            </p>
          </div>
          <button onClick={handleMore} className={styles.moreButton}>
            <img src={MoreIcon} alt="More" />
          </button>
        </div>

        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => {
              navigate(
                `/videos?campaignId=${id}isSubmission=true?isDetailed=true`
              );
            }}
          >
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

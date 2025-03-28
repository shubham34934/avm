import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import {
  fetchCompetitionById,
  updateCampaignStatus,
} from "../../reducers/competitions";
import { fetchUserByUsername } from "../../reducers/users";
import { fetchVideoPosts } from "../../reducers/videoPosts";
import { toast } from "react-toastify";
import styles from "./CampaignDetails.module.css";
import Button from "../../components/Button/Button";
import Timeline from "../../components/Timeline/Timeline";
import {
  BlockCampaignModal,
  RescheduleCampaignModal,
} from "../../components/Modals";
import SubmissionCard from "../../components/Submission/SubmissionCard";
import DateRange from "../../components/DateRange/DateRange";
import Header from "../../components/Header/Header";
import userAvatar from "./../../assets/images/users/1.png";
import MoreIcon from "./../../assets/icons/more.svg";
import rightArrow from "./../../assets/icons/rightArrow.svg";

// Icons
import rescheduleIcon from "../../assets/icons/campaign_timeline/reschedule.svg";
import blockIcon from "../../assets/icons/campaign_timeline/block.svg";
import campaignStartedIcon from "../../assets/icons/campaign_timeline/campaign_started.svg";
import completedIcon from "../../assets/icons/campaign_timeline/completed.svg";
import selectWinnersIcon from "../../assets/icons/campaign_timeline/select_winners.svg";
import shortlistReminderIcon from "../../assets/icons/campaign_timeline/shortlistReminder.svg";
import winnerAnnouncedIcon from "../../assets/icons/campaign_timeline/winner_announced.svg";
import paymentSentIcon from "../../assets/icons/campaign_timeline/payment_sent.svg";
import doneIcon from "../../assets/icons/campaign_timeline/done.svg";
import pauseIcon from "../../assets/icons/campaign_timeline/pause.svg";
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
  const { videoPosts, loading: videoPostsLoading } = useAppSelector(
    (state) => state.videoPosts
  );
  const [timeLeft, setTimeLeft] = useState("");
  const [campaignStatus, setCampaignStatus] = useState("upcoming"); // upcoming, active, ended
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleActionType, setRescheduleActionType] =
    useState("reschedule"); // 'pause' or 'reschedule'
  const timerRef = useRef(null);

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

  // Calculate and update countdown timer
  useEffect(() => {
    if (!selectedCompetition) return;

    const updateCountdown = () => {
      const now = new Date();
      const startDate = new Date(selectedCompetition.startDate);
      const endDate = new Date(selectedCompetition.endDate);

      // Determine campaign status
      if (now < startDate) {
        setCampaignStatus("upcoming");
        // Calculate time difference for upcoming campaign
        const timeDiff = startDate - now;

        // Convert to days, hours, minutes, seconds
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // Format the time left string
        let timeLeftStr = "";
        if (days > 0) timeLeftStr += `${days}d `;
        if (hours > 0 || days > 0) timeLeftStr += `${hours}h `;
        if (minutes > 0 || hours > 0 || days > 0) timeLeftStr += `${minutes}m `;
        timeLeftStr += `${seconds}s`;

        setTimeLeft(timeLeftStr);
      } else if (now >= startDate && now <= endDate) {
        setCampaignStatus("active");
        // Calculate time difference for active campaign (time remaining)
        const timeDiff = endDate - now;

        // Convert to days, hours, minutes, seconds
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // Format the time left string
        let timeLeftStr = "";
        if (days > 0) timeLeftStr += `${days}d `;
        if (hours > 0 || days > 0) timeLeftStr += `${hours}h `;
        if (minutes > 0 || hours > 0 || days > 0) timeLeftStr += `${minutes}m `;
        timeLeftStr += `${seconds}s`;

        setTimeLeft(timeLeftStr);
      } else {
        setCampaignStatus("ended");
        setTimeLeft("Ended");
      }
    };

    // Initial update
    updateCountdown();

    // Set up interval to update every second
    timerRef.current = setInterval(updateCountdown, 1000);

    // Clean up interval on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedCompetition]);

  // Fetch video posts related to this competition
  useEffect(() => {
    const fetchCompetitionVideos = async () => {
      if (!id) return;

      setLoadingSubmissions(true);
      try {
        // Fetch videos with competition filter
        const result = await dispatch(
          fetchVideoPosts({
            competition: { id: parseInt(id) },
            page: 0,
            size: 20,
            sort: "createdOn,desc",
          })
        ).unwrap();

        // Process the response based on its structure
        const videoContent = Array.isArray(result)
          ? result
          : result && result.content
          ? result.content
          : [];

        // Set the total submission count
        if (result && result.totalElements) {
          setSubmissionCount(result.totalElements);
        } else if (Array.isArray(videoContent)) {
          setSubmissionCount(videoContent.length);
        }

        // Transform video posts to submission format
        const formattedSubmissions = videoContent.map((video) => {
          // Extract video ID and get thumbnail
          const videoUrl = video.url || video.videoUrl;
          const videoId = getYouTubeVideoId(videoUrl);
          const thumbnailUrl = videoId
            ? getYouTubeThumbnail(videoId)
            : videoUrl;

          return {
            id: video.id,
            image: thumbnailUrl, // Using YouTube thumbnail if available
            title: video.title,
            views: "0", // Default value if views not available
            videoUrl: videoUrl,
          };
        });

        setSubmissions(formattedSubmissions);
      } catch (error) {
        console.error("Error fetching competition videos:", error);
        toast.error("Failed to load submissions");
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchCompetitionVideos();
  }, [id, dispatch]);

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    try {
      // Handle different YouTube URL formats
      if (url.includes("youtube.com/watch")) {
        // Format: https://www.youtube.com/watch?v=VIDEO_ID
        const urlParams = new URLSearchParams(url.split("?")[1]);
        return urlParams.get("v");
      } else if (url.includes("youtu.be")) {
        // Format: https://youtu.be/VIDEO_ID
        return url.split("/").pop();
      } else if (url.includes("youtube.com/embed")) {
        // Format: https://www.youtube.com/embed/VIDEO_ID
        return url.split("/").pop().split("?")[0];
      }
    } catch (error) {
      console.error("Error extracting YouTube video ID:", error);
      return null;
    }

    return null;
  };

  // Function to get YouTube thumbnail URL from video ID
  const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return null;
    // YouTube provides several thumbnail options, using the high quality one
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMore = () => {
    // Handle more options
  };

  const handleBlockModalClose = () => {
    setIsBlockModalOpen(false);
  };

  const handleBlockCampaign = async (remark) => {
    try {
      await dispatch(
        updateCampaignStatus({
          id: selectedCompetition.id,
          status: "Blocked",
          remark,
          username: "current_user",
        })
      ).unwrap();
      toast.success("Campaign blocked successfully");
      // Refresh competition data
      dispatch(fetchCompetitionById(selectedCompetition.id));
    } catch (error) {
      toast.error("Failed to block campaign");
    } finally {
      setIsBlockModalOpen(false);
    }
  };

  const handlePauseCampaign = () => {
    handleRescheduleModalOpen("pause");
  };

  const handleResumeCampaign = async () => {
    try {
      await dispatch(
        updateCampaignStatus({
          id: selectedCompetition.id,
          status: "Active",
          username: "current_user",
        })
      ).unwrap();
      toast.success("Campaign resumed successfully");
      // Refresh competition data
      dispatch(fetchCompetitionById(selectedCompetition.id));
    } catch (error) {
      toast.error("Failed to resume campaign");
    }
  };

  const handleRescheduleModalOpen = (type) => {
    setRescheduleActionType(type);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (data) => {
    try {
      const { remark, startDate, endDate, status } = data;
      const payload = {
        id: selectedCompetition.id,
        status:
          status || (rescheduleActionType === "pause" ? "pause" : "Scheduled"),
        remark,
        username: "current_user",
      };

      // Add dates if provided
      if (startDate) {
        payload.startDate = startDate; // Already in YYYY-MM-DD format from date input
      }

      if (endDate) {
        payload.endDate = endDate; // Already in YYYY-MM-DD format from date input
      }

      await dispatch(updateCampaignStatus(payload)).unwrap();

      toast.success(
        rescheduleActionType === "pause"
          ? "Campaign paused successfully"
          : "Campaign rescheduled successfully"
      );

      // Refresh competition data
      dispatch(fetchCompetitionById(selectedCompetition.id));
    } catch (error) {
      toast.error(
        rescheduleActionType === "pause"
          ? "Failed to pause campaign"
          : "Failed to reschedule campaign"
      );
      console.error("Error updating campaign status:", error);
    } finally {
      setIsRescheduleModalOpen(false);
    }
  };

  // Helper function to format date from DD/MM/YYYY to YYYY-MM-DD
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;

    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  // Timeline steps
  const timelineSteps = [
    {
      type: "created",
      title: "Campaign Created",
      timestamp: selectedCompetition?.createdOn || "",
      isActive: true, // Always active once created
      actions: [
        {
          label: "Reschedule",
          onClick: () => handleRescheduleModalOpen("reschedule"),
          icon: <img src={rescheduleIcon} alt="Reschedule" />,
        },
        {
          label: "Block",
          onClick: () => setIsBlockModalOpen(true),
          variant: "block",
          icon: <img src={blockIcon} alt="Block" />,
        },
      ],
    },
    {
      type: "started",
      title: "Campaign Started",
      timestamp: selectedCompetition?.startDate || "",
      isActive:
        (selectedCompetition?.status === "Scheduled" ||
          selectedCompetition?.status === "Active" ||
          selectedCompetition?.status === "pause" ||
          selectedCompetition?.status === "ClosedWinnersPending" ||
          selectedCompetition?.status === "ClosedWinnersSelected" ||
          selectedCompetition?.status === "ClosedWinnersAnnounced") &&
        selectedCompetition?.startDate &&
        new Date(selectedCompetition.startDate) <= new Date(),
      actions: [
        {
          label: selectedCompetition?.status === "pause" ? "Resume" : "Pause",
          onClick:
            selectedCompetition?.status === "pause"
              ? handleResumeCampaign
              : handlePauseCampaign,
          icon: <img src={pauseIcon} alt="Pause/Resume" />,
        },
        {
          label: "Reschedule",
          onClick: () => handleRescheduleModalOpen("reschedule"),
          icon: <img src={rescheduleIcon} alt="Reschedule" />,
        },
      ],
    },
    {
      type: "completed",
      title: `Completed ${
        submissionCount > 0
          ? `(${submissionCount.toLocaleString()} submissions)`
          : ""
      }`,
      timestamp: selectedCompetition?.endDate || "",
      isActive:
        selectedCompetition?.status === "ClosedWinnersPending" ||
        selectedCompetition?.status === "ClosedWinnersSelected" ||
        selectedCompetition?.status === "ClosedWinnersAnnounced",
      actions: [
        {
          label: "Shortlist Reminder",
          onClick: () => console.log("Send reminder clicked"),
          icon: <img src={shortlistReminderIcon} alt="Shortlist Reminder" />,
        },
      ],
    },
    {
      type: "select_winners",
      title: "Select Winners",
      timestamp: "",
      isActive:
        selectedCompetition?.status === "ClosedWinnersSelected" ||
        selectedCompetition?.status === "ClosedWinnersAnnounced",
      actions: [
        {
          label: "Choose Winners",
          onClick: () => console.log("Choose winners clicked"),
          icon: <img src={selectWinnersIcon} alt="Choose Winners" />,
        },
        {
          label: "Send Reminder",
          onClick: () => console.log("Send reminder clicked"),
          icon: <img src={shortlistReminderIcon} alt="Send Reminder" />,
        },
      ],
    },
    {
      type: "winner_announced",
      title: "Winner Announced",
      timestamp: "",
      isActive: selectedCompetition?.status === "ClosedWinnersAnnounced",
      actions: [
        {
          label: "View Winners",
          onClick: () => console.log("View winners clicked"),
          icon: <img src={winnerAnnouncedIcon} alt="View Winners" />,
        },
      ],
    },
    {
      type: "payment_sent",
      title: "Payment Sent",
      timestamp: "",
      isActive: selectedCompetition?.paymentStatus === "PAID",
      actions: [
        {
          label: "Payment Details",
          onClick: () => console.log("Payment details clicked"),
          icon: <img src={paymentSentIcon} alt="Payment Details" />,
        },
      ],
    },
    {
      type: "done",
      title: "Remittance done",
      timestamp: "",
      isActive: selectedCompetition?.paymentStatus === "REMITTANCE_DONE",
      actions: [
        {
          label: "View Remittance",
          onClick: () => console.log("View remittance clicked"),
          icon: <img src={doneIcon} alt="View Remittance" />,
        },
      ],
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Draft":
        return styles.statusDraft;
      case "Scheduled":
        return styles.statusScheduled;
      case "Active":
        return styles.statusActive;
      case "Paused":
        return styles.statusPaused;
      case "Blocked":
        return styles.statusBlocked;
      case "ClosedWinnersPending":
      case "ClosedWinnersSelected":
      case "ClosedWinnersAnnounced":
        return styles.statusClosed;
      default:
        return "";
    }
  };

  const formatStatus = (status) => {
    console.log({ status }, "sfsfsf");
    switch (status) {
      case "Draft":
        return "Draft";
      case "Scheduled":
        return "Scheduled";
      case "Active":
        return "Active";
      case "Paused":
        return "Paused";
      case "Blocked":
        return "Blocked";
      case "ClosedWinnersPending":
        return "Closed - Winners Pending";
      case "ClosedWinnersSelected":
        return "Closed - Winners Selected";
      case "ClosedWinnersAnnounced":
        return "Closed - Winners Announced";
      default:
        return "";
    }
  };

  if (competitionLoading || userLoading || videoPostsLoading) {
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

  console.log({ selectedCompetition });
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
        {campaignStatus === "upcoming" && <span>Starts in {timeLeft}</span>}
        {campaignStatus === "active" && <span>Ends in {timeLeft}</span>}
        {campaignStatus === "ended" && <span>Campaign ended</span>}
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

        <h2 className={styles.title}>
          About Campaign{" "}
          <span
            className={`${styles.statusBadge} ${getStatusClass(
              selectedCompetition.status
            )}`}
          >
            {formatStatus(selectedCompetition.status)}
          </span>
        </h2>
        <div className={styles.sponsorInfo}>
          {selectedCompetition.sponsor ? (
            <>
              <img
                src={
                  selectedCompetition.sponsor.logoUrl ||
                  "https://via.placeholder.com/32"
                }
                alt="Sponsor"
                className={styles.sponsorLogo}
              />
              <span className={styles.sponsorName}>
                {selectedCompetition.sponsor.name || "Sponsor"}
              </span>
            </>
          ) : (
            <span className={styles.sponsorName}>No sponsor</span>
          )}
        </div>
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
                `/videos?campaignId=${id}&isSubmission=true&isDetailed=true`
              );
            }}
          >
            <h2>Submissions</h2>
            <button className={styles.viewAll}>
              <img src={rightArrow} alt="view all" />
            </button>
          </div>
          <div className={styles.submissionsList}>
            {loadingSubmissions ? (
              <div className={styles.loadingSubmissions}>
                Loading submissions...
              </div>
            ) : submissions.length > 0 ? (
              submissions.map((submission) => (
                <SubmissionCard key={submission.id} {...submission} />
              ))
            ) : (
              <div className={styles.noSubmissions}>No submissions yet</div>
            )}
          </div>
        </div>

        <Timeline steps={timelineSteps} />
      </div>
      {isBlockModalOpen && (
        <BlockCampaignModal
          isOpen={isBlockModalOpen}
          onClose={handleBlockModalClose}
          campaignName={selectedCompetition?.name || "Campaign Name"}
          onBlock={handleBlockCampaign}
        />
      )}
      {isRescheduleModalOpen && (
        <RescheduleCampaignModal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          campaignName={selectedCompetition?.title || "Campaign Name"}
          actionType={rescheduleActionType}
          onSubmit={handleRescheduleSubmit}
          currentStartDate={selectedCompetition?.startDate}
          currentEndDate={selectedCompetition?.endDate}
        />
      )}
    </div>
  );
};

export default CampaignDetails;

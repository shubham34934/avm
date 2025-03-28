import PropTypes from "prop-types";
import styles from "./Timeline.module.css";

// Campaign timeline icons
import campaignCreatedIcon from "../../assets/icons/campaign_timeline/campaign_created.svg";
import campaignStartedIcon from "../../assets/icons/campaign_timeline/campaign_started.svg";
import completedIcon from "../../assets/icons/campaign_timeline/completed.svg";
import selectWinnersIcon from "../../assets/icons/campaign_timeline/select_winners.svg";
import winnerAnnouncedIcon from "../../assets/icons/campaign_timeline/winner_announced.svg";
import paymentSentIcon from "../../assets/icons/campaign_timeline/payment_sent.svg";
import doneIcon from "../../assets/icons/campaign_timeline/done.svg";
import Button from "../Button/Button";

const Timeline = ({ steps }) => {
  // Find the index of the current active stage
  const currentStageIndex = steps.findIndex(step => step.isActive);

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineConnector}></div>
      {steps.map((step, index) => (
        <div key={step.title} className={styles.timelineItemContainer}>
          {/* Timeline item */}
          <div className={styles.timelineItem}>
            <div
              className={`${styles.iconWrapper} ${
                step.isActive ? styles.active : ""
              }`}
            >
              <img
                src={getIconForStep(step.type)}
                alt={step.title}
                className={styles.icon}
              />
            </div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineTitle}>{step.title}</div>
              {step.timestamp && (
                <div className={styles.timelineTimestamp}>
                  {formatTimestamp(step.timestamp)}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons only for the current stage */}
          {index === currentStageIndex && 
           index < steps.length - 1 &&
           step.actions &&
           step.actions.length > 0 && (
            <div className={styles.actionButtons}>
              {step.actions.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  variant="text"
                  className={styles.actionButton}
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {action.icon && (
                    <span className={styles.actionIcon}>{action.icon}</span>
                  )}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Small spacing line for non-current stages */}
          {index !== currentStageIndex && 
           index < steps.length - 1 && (
            <div className={styles.spacingLine}></div>
          )}
        </div>
      ))}
    </div>
  );
};

const getIconForStep = (type) => {
  switch (type) {
    case "created":
      return campaignCreatedIcon;
    case "started":
      return campaignStartedIcon;
    case "completed":
      return completedIcon;
    case "select_winners":
      return selectWinnersIcon;
    case "winner_announced":
      return winnerAnnouncedIcon;
    case "payment_sent":
      return paymentSentIcon;
    case "done":
      return doneIcon;
    default:
      return campaignCreatedIcon;
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp; // Return as is if not a valid date

    return `${date.getHours()}:${String(date.getMinutes()).padStart(
      2,
      "0"
    )} ${date.toLocaleString("default", { month: "long" })} ${date.getDate()}`;
  } catch (error) {
    return timestamp; // Return as is if there's an error
  }
};

Timeline.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      timestamp: PropTypes.string,
      isActive: PropTypes.bool,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          onClick: PropTypes.func,
          variant: PropTypes.string,
          icon: PropTypes.node,
          disabled: PropTypes.bool,
        })
      ),
    })
  ).isRequired,
};

export default Timeline;

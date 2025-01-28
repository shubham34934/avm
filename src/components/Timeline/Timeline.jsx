import PropTypes from 'prop-types';
import TimelineItem from './TimelineItem';
import styles from './Timeline.module.css';

// Campaign timeline icons
import campaignCreatedIcon from '../../assets/icons/campaign_timeline/campaign_created.svg';
import campaignStartedIcon from '../../assets/icons/campaign_timeline/campaign_started.svg';
import completedIcon from '../../assets/icons/campaign_timeline/completed.svg';
import selectWinnersIcon from '../../assets/icons/campaign_timeline/select_winners.svg';
import winnerAnnouncedIcon from '../../assets/icons/campaign_timeline/winner_announced.svg';
import paymentSentIcon from '../../assets/icons/campaign_timeline/payment_sent.svg';
import doneIcon from '../../assets/icons/campaign_timeline/done.svg';

const Timeline = ({ steps }) => {
  return (
    <div className={styles.timeline}>
      {steps.map((step, index) => (
        <TimelineItem
          key={step.title}
          icon={getIconForStep(step.type)}
          title={step.title}
          timestamp={step.timestamp}
          isActive={step.isActive}
          isLast={index === steps.length - 1}
          reminder={step.reminder}
          description={step.description}
        />
      ))}
    </div>
  );
};

const getIconForStep = (type) => {
  switch (type) {
    case 'campaign_created':
      return campaignCreatedIcon;
    case 'campaign_started':
      return campaignStartedIcon;
    case 'completed':
      return completedIcon;
    case 'select_winners':
      return selectWinnersIcon;
    case 'winner_announced':
      return winnerAnnouncedIcon;
    case 'payment_sent':
      return paymentSentIcon;
    case 'done':
      return doneIcon;
    default:
      return campaignCreatedIcon;
  }
};

Timeline.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      timestamp: PropTypes.string,
      isActive: PropTypes.bool,
      reminder: PropTypes.string,
      description: PropTypes.string
    })
  ).isRequired
};

export default Timeline;

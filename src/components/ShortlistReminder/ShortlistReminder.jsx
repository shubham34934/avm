import PropTypes from 'prop-types';
import BottomSheet from '../BottomSheet/BottomSheet';
import styles from './ShortlistReminder.module.css';

const ShortlistReminder = ({ isOpen, onClose, campaignName, endDate }) => {
  const handleSendReminder = () => {
    // Handle sending reminder
    console.log('Sending reminder...');
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Shortlist Reminder"
      primaryAction={handleSendReminder}
      primaryActionText="Send Reminder"
    >
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Reminder Message</h3>
          <p className={styles.message}>
            This is a reminder to shortlist winners for your campaign,
            "{campaignName}", which ended on {endDate}.
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>To complete this step:</h3>
          <ol className={styles.steps}>
            <li>Go to the "Campaigns" section in your dashboard.</li>
            <li>Select the campaign {campaignName}.</li>
            <li>Review and shortlist the best videos.</li>
            <li>
              Shortlisting winners ensures we can move forward with
              announcements and prize distributions.
            </li>
          </ol>
        </div>
      </div>
    </BottomSheet>
  );
};

ShortlistReminder.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  campaignName: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired
};

export default ShortlistReminder;

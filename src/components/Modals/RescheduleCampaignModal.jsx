import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import BottomSheet from '../BottomSheet/BottomSheet';
import styles from './RescheduleCampaignModal.module.css';
import calendarIcon from '../../assets/icons/calendar.svg';

const RescheduleCampaignModal = ({ 
  isOpen, 
  onClose, 
  campaignName, 
  onSubmit,
  actionType, // 'pause' or 'reschedule'
  currentStartDate,
  currentEndDate
}) => {
  const [remark, setRemark] = useState('');
  const [startDate, setStartDate] = useState(currentStartDate || '');
  const [endDate, setEndDate] = useState(currentEndDate || '');

  // Get today's date in YYYY-MM-DD format
  const today = useMemo(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }, []);

  const handleSubmit = () => {
    onSubmit({
      remark,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
  };

  const getTitle = () => {
    if (actionType === 'pause') {
      return `Pause ${campaignName}`;
    } else if (actionType === 'reschedule') {
      return `Reschedule ${campaignName}`;
    }
    return `Update ${campaignName}`;
  };

  const getActionText = () => {
    return actionType === 'pause' ? 'Pause' : 'Reschedule';
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      primaryAction={handleSubmit}
      primaryActionText={getActionText()}
      secondaryActionText="Close"
    >
      <div className={styles.container}>
        <p className={styles.description}>Description for admin</p>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Remark</label>
          <textarea
            className={styles.textarea}
            placeholder="Add remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={3}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>New Start Date (optional)</label>
          <div className={styles.dateInputWrapper}>
            <input
              type="date"
              className={styles.dateInput}
              placeholder="DD/MM/YYYY"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
            />
            <img
              src={calendarIcon}
              alt="Calendar"
              className={styles.calendarIcon}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>New End Date (optional)</label>
          <div className={styles.dateInputWrapper}>
            <input
              type="date"
              className={styles.dateInput}
              placeholder="DD/MM/YYYY"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={
                startDate
                  ? (() => {
                      const minDate = new Date(startDate);
                      minDate.setDate(minDate.getDate() + 1);
                      return minDate.toISOString().split('T')[0];
                    })()
                  : today
              }
            />
            <img
              src={calendarIcon}
              alt="Calendar"
              className={styles.calendarIcon}
            />
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

RescheduleCampaignModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  campaignName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  actionType: PropTypes.oneOf(['pause', 'reschedule']).isRequired,
  currentStartDate: PropTypes.string,
  currentEndDate: PropTypes.string
};

export default RescheduleCampaignModal;

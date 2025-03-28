import { useState } from 'react';
import PropTypes from 'prop-types';
import BottomSheet from '../BottomSheet/BottomSheet';
import styles from './RescheduleCampaignModal.module.css';

const RescheduleCampaignModal = ({ 
  isOpen, 
  onClose, 
  campaignName, 
  onSubmit,
  actionType // 'pause' or 'reschedule'
}) => {
  const [remark, setRemark] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
          <input
            type="text"
            className={styles.input}
            placeholder="DD/MM/YYYY"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>New End Date (optional)</label>
          <input
            type="text"
            className={styles.input}
            placeholder="DD/MM/YYYY"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
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
  actionType: PropTypes.oneOf(['pause', 'reschedule']).isRequired
};

export default RescheduleCampaignModal;

import { useState } from 'react';
import PropTypes from 'prop-types';
import BottomSheet from '../BottomSheet/BottomSheet';
import styles from './BlockCampaignModal.module.css';

const BlockCampaignModal = ({ isOpen, onClose, campaignName, onBlock }) => {
  const [remark, setRemark] = useState('');

  const handleBlock = () => {
    onBlock(remark);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Block ${campaignName}`}
      primaryAction={handleBlock}
      primaryActionText="Block"
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
      </div>
    </BottomSheet>
  );
};

BlockCampaignModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  campaignName: PropTypes.string.isRequired,
  onBlock: PropTypes.func.isRequired,
};

export default BlockCampaignModal;

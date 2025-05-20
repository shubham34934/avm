import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CreatorRoleModal.module.css';
import Button from '../Button/Button';

const CreatorRoleModal = ({ isOpen, onClose, onConfirm, mode }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleConfirm = () => {
    onConfirm(phoneNumber);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {mode === 'add' ? 'Add Creator Role' : 'Remove Creator Role'}
        </h2>
        <p className={styles.message}>
          {mode === 'add'
            ? 'Please provide the phone number for the creator. Additional information will be required to complete the creator profile.'
            : 'Are you sure you want to remove the creator role? This action cannot be undone.'}
        </p>
        {mode === 'add' && (
          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.input}
              placeholder="Enter phone number"
            />
          </div>
        )}
        <div className={styles.actions}>
          <Button
            onClick={onClose}
            variant="secondary"
            className={styles.button}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            className={styles.button}
            disabled={mode === 'add' && !phoneNumber}
          >
            {mode === 'add' ? 'Add' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  );
};

CreatorRoleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'remove']).isRequired,
};

export default CreatorRoleModal; 
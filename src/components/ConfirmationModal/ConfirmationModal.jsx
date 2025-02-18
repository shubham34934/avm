import React from 'react';
import styles from './ConfirmationModal.module.css';
import Button from '../Button/Button';

const ConfirmationModal = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel' 
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button 
            onClick={onCancel} 
            variant="secondary"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="danger"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

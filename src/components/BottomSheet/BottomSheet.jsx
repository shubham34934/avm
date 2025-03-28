import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './BottomSheet.module.css';

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  primaryAction,
  primaryActionText,
  secondaryActionText = 'Close',
  onPrimaryAction
}) => {
  const sheetRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        if (overlayRef.current) overlayRef.current.classList.add(styles.visible);
        if (sheetRef.current) sheetRef.current.classList.add(styles.visible);
      });
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current) overlayRef.current.classList.remove(styles.visible);
    if (sheetRef.current) {
      sheetRef.current.classList.remove(styles.visible);
      sheetRef.current.addEventListener('transitionend', () => {
        onClose();
      }, { once: true });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        ref={overlayRef}
        className={styles.overlay} 
        onClick={handleClose}
      />
      <div 
        ref={sheetRef}
        className={styles.bottomSheet}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.handle} />
        
        {title && (
          <h2 className={styles.title}>{title}</h2>
        )}

        <div className={styles.content}>
          {children}
        </div>

        <div className={styles.actions}>
          <button 
            onClick={handleClose} 
            className={styles.secondaryButton}
          >
            {secondaryActionText}
          </button>
          {primaryAction && (
            <button 
              onClick={() => {
                if (typeof primaryAction === 'function') {
                  primaryAction();
                } else if (typeof onPrimaryAction === 'function') {
                  onPrimaryAction();
                }
                handleClose();
              }} 
              className={styles.primaryButton}
            >
              {primaryActionText}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  primaryAction: PropTypes.func,
  primaryActionText: PropTypes.string,
  secondaryActionText: PropTypes.string,
  onPrimaryAction: PropTypes.func
};

export default BottomSheet;

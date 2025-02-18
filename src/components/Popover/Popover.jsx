import { useEffect, useRef } from 'react';
import styles from './Popover.module.css';

const Popover = ({ children, onClose }) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.popoverContainer} ref={popoverRef}>
      {children}
    </div>
  );
};

export default Popover;

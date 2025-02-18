import { useEffect, useRef } from 'react';
import styles from './Popover.module.css';

const Popover = ({ children, onClose }) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is inside the popover or on the menu button (which has data-menu-button), ignore it
      if (
        popoverRef.current?.contains(event.target) ||
        event.target.closest('[data-menu-button]')
      ) {
        return;
      }
      onClose?.();
    };

    // Use mousedown to handle the event before the button click
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

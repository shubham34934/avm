import React from 'react';
import PropTypes from 'prop-types';
import styles from './Error.module.css';

const Error = ({ 
  title = 'Something went wrong', 
  message, 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className={styles.title}>{title}</h2>
        {message && <p className={styles.message}>{message}</p>}
        {showRetry && onRetry && (
          <button onClick={onRetry} className={styles.retryButton}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

Error.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  showRetry: PropTypes.bool
};

export default Error;

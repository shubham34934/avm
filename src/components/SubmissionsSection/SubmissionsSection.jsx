import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './SubmissionsSection.module.css';
import SubmissionCard from '../Submission/SubmissionCard';
import rightArrow from '../../assets/icons/rightArrow.svg';

const SubmissionsSection = ({
  title,
  submissions,
  loading,
  viewAllLink,
  emptyMessage = 'No submissions yet'
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>{title}</h2>
        {viewAllLink && (
          <button 
            className={styles.viewAll} 
            onClick={() => navigate(viewAllLink)}
          >
            <img src={rightArrow} alt="View all" className={styles.rightArrow} />
          </button>
        )}
      </div>
      <div className={styles.submissionsList}>
        {loading ? (
          <div className={styles.loadingSubmissions}>
            Loading submissions...
          </div>
        ) : submissions.length > 0 ? (
          submissions.map((submission) => (
            <SubmissionCard key={submission.id} {...submission} />
          ))
        ) : (
          <div className={styles.noSubmissions}>{emptyMessage}</div>
        )}
      </div>
    </div>
  );
};

SubmissionsSection.propTypes = {
  title: PropTypes.string.isRequired,
  submissions: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  viewAllLink: PropTypes.string,
  emptyMessage: PropTypes.string
};

SubmissionsSection.defaultProps = {
  loading: false,
  emptyMessage: 'No submissions yet'
};

export default SubmissionsSection;

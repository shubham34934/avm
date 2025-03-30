import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './SubmissionCard.module.css';
import likeColored from "./../../assets/icons/like_colored.svg";
import { setVideoList } from '../../reducers/videoNavigation';

const SubmissionCard = ({ id, image, title, views, allSubmissions, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    // If we have all submissions, set up the video navigation context
    if (allSubmissions && allSubmissions.length > 0) {
      dispatch(
        setVideoList({
          videos: allSubmissions,
          initialIndex: index || allSubmissions.findIndex(submission => submission.id === id) || 0,
          context: {
            source: 'submissions',
          },
        })
      );
    }
    
    // Navigate to the video player page
    navigate(`/videos/${id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.stats}>
          <img src={likeColored} alt=""/>
          <span className={styles.views}>{views}</span>
        </div>
      </div>
    </div>
  );
};

SubmissionCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  views: PropTypes.string.isRequired,
  allSubmissions: PropTypes.array,
  index: PropTypes.number
};

export default SubmissionCard;

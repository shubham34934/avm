import PropTypes from 'prop-types';
import styles from './SubmissionCard.module.css';
import likeColored from "./../../assets/icons/like_colored.svg"
const SubmissionCard = ({ image, title, views }) => {
  return (
    <div className={styles.card}>
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
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  views: PropTypes.string.isRequired
};

export default SubmissionCard;

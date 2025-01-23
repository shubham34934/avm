import PropTypes from 'prop-types';
import styles from './ListCard.module.css';
import Tag from '../Tag/Tag';
import moreIcon from '../../assets/icons/more.svg';

const ListCard = ({
  image,
  title,
  subtitle,
  status,
  onClick
}) => {
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.content}>
        <img src={image} alt={title} className={styles.image} />
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{title}</h3>
            {status && <Tag text={status} variant={status.toLowerCase()} size="small" />}
          </div>
          <span className={styles.subtitle}>{subtitle}</span>
        </div>
      </div>
      <button className={styles.moreButton} aria-label="More options">
        <img src={moreIcon} alt="More" className={styles.moreIcon} />
      </button>
    </div>
  );
};

ListCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  status: PropTypes.string,
  onClick: PropTypes.func
};

export default ListCard;

import PropTypes from 'prop-types';
import styles from './Tag.module.css';

const TAG_VARIANTS = {
  accent:{
    backgroundColor: '#A99985',
    color: "white",
  },
  pending: {
    backgroundColor: 'var(--warning-light)',
    color: 'var(--warning)',
  },
  inProgress: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
  },
  inactive: {
    backgroundColor: 'var(--error-light)',
    color: 'var(--error)',
  },
  superAdmin: {
    backgroundColor: 'var(--success-light)',
    color: 'var(--success)',
  },
  default: {
    backgroundColor: 'var(--gray-100)',
    color: 'var(--text-secondary)',
  }
};

const Tag = ({ text, variant = 'default', size = 'medium' }) => {
  const variantStyles = TAG_VARIANTS[variant] || TAG_VARIANTS.default;
  
  return (
    <span 
      className={`${styles.tag} ${styles[size]}`}
      style={{
        backgroundColor: variantStyles.backgroundColor,
        color: variantStyles.color
      }}
    >
      {text}
    </span>
  );
};

Tag.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['pending', 'inProgress', 'inactive', 'superAdmin', 'default',"accent"]),
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default Tag;

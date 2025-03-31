import PropTypes from "prop-types";
import styles from "./Tag.module.css";

const TAG_VARIANTS = {
  accent: {
    backgroundColor: "#A99985",
    color: "white",
  },
  pending: {
    backgroundColor: "#C3C9D0",
    color: "white",
  },
  ["in progress"]: {
    backgroundColor: "#E3F3EF",
    color: "#1A875B",
  },
  active: {
    backgroundColor: "#E3F3EF",
    color: "#1A875B",
  },
  inactive: {
    backgroundColor: "var(--error-light)",
    color: "var(--error)",
  },
  blocked: {
    backgroundColor: "var(--error-light)",
    color: "var(--error)",
  },
  superAdmin: {
    backgroundColor: "var(--success-light)",
    color: "var(--success)",
  },
  default: {
    backgroundColor: "var(--gray-100)",
    color: "var(--text-secondary)",
  },
};

const Tag = ({ text, variant = "default", size = "medium", style = {} }) => {
  const variantStyles = TAG_VARIANTS[variant] || TAG_VARIANTS.default;
  if (!text || text === "User") return;
  return (
    <span
      className={`${styles.tag} ${styles[size]}`}
      style={{
        ...style,
        backgroundColor: variantStyles.backgroundColor,
        color: variantStyles.color,
      }}
    >
      {text}
    </span>
  );
};

Tag.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  style: PropTypes.object,
};

export default Tag;

import { useNavigate, useLocation } from "react-router-dom";
import { FOOTER_ITEMS } from "../../constants/navigation";
import styles from "./Footer.module.css";
import { usePermissions } from "../../hooks/usePermissions";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = usePermissions();

  // Filter navigation items based on user's role
  const filteredNavItems = FOOTER_ITEMS.filter((item) =>
    item.roles.includes(userRole)
  );

  // Helper function to get the label (handles both string and function labels)
  const getLabel = (item) => {
    return typeof item.label === "function" ? item.label({ userRole }) : item.label;
  };

  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              onClick={() => navigate(item.path)}
              aria-label={getLabel(item)}
            >
              <img
                src={item.icon}
                alt=""
                className={styles.icon}
                aria-hidden="true"
              />
              <span className={styles.label}>{getLabel(item)}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default Footer;

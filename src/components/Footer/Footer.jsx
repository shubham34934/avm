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
              aria-label={item.label}
            >
              <img
                src={item.icon}
                alt=""
                className={styles.icon}
                aria-hidden="true"
              />
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default Footer;

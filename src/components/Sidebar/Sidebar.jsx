import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { SIDEBAR_ITEMS } from "../../constants/navigation";
import styles from "./Sidebar.module.css";
import PropTypes from "prop-types";
import LogoutIcon from "../../assets/icons/logout.svg";
import editIcon from "./../../assets/icons/edit.svg";
import Tag from "../Tag/Tag";
import { useAppDispatch } from "../../config/store";
import { logout } from "../../reducers/authentication";
import { toast } from "react-toastify";
import { checkAllowedRole } from "../../utils/constants";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const dispatch = useAppDispatch();

  const filteredNavItems = SIDEBAR_ITEMS.filter((item) =>
    checkAllowedRole(item.roles, user?.authorities)
  );

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Close sidebar regardless of screen size
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user?.name}</h2>
            <Tag text={user?.role} variant={"accent"} size="small" />
          </div>
          <div className={styles.editIconContainer}>
            <img src={editIcon} alt="Edit" className={styles.editIcon} />
          </div>
        </div>

        <nav className={styles.nav}>
          {filteredNavItems.map((item) => (
            <div
              key={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path ? styles.active : ""
              }`}
              onClick={() => handleNavigation(item.path)}
              aria-label={item.label}
            >
              <img
                src={item.icon}
                alt=""
                className={styles.icon}
                aria-hidden="true"
              />
              <span className={styles.label}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div
          className={`${styles.navItem} ${styles.logoutButton}`}
          onClick={handleLogout}
        >
          <img src={LogoutIcon} alt="" className={styles.icon} />
          <span className={styles.label}>Logout</span>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;

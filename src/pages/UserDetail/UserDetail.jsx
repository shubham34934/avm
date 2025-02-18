import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { fetchUserByUsername } from "../../reducers/users";
import styles from "./UserDetail.module.css";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import defaultAvatar from "../../assets/images/default-avatar.png";
import { getUserTypeDisplay, getUserTitle } from "../../utils/constants";

const UserDetail = () => {
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    selectedUser: user,
    loading,
    error,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (username) {
      dispatch(fetchUserByUsername(username));
    }
  }, [dispatch, username]);

  const handleBack = () => {
    navigate(-1);
  };

  const userTypeDisplay = getUserTypeDisplay(user?.authorities);

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <Error
          title="Failed to Load User Details"
          message={error}
          onRetry={() => dispatch(fetchUserByUsername(username))}
        />
      );
    }

    if (!user) {
      return (
        <Error
          title="User Not Found"
          message="The requested user could not be found."
          showRetry={false}
        />
      );
    }

    return (
      <div className={styles.content}>
        <div className={styles.profileHeader}>
          <img
            src={user.imageUrl || defaultAvatar}
            alt={getUserTitle(user)}
            className={styles.profileImage}
          />
          <h2 className={styles.userName}>{getUserTitle(user)}</h2>
          <div className={styles.userRole}>{userTypeDisplay}</div>
        </div>

        <div className={styles.detailsContainer}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Information</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <label>Username</label>
                <span>{user.login}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Status</label>
                <span
                  className={user.activated ? styles.active : styles.inactive}
                >
                  {user.activated ? "Active" : "Inactive"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <label>Language</label>
                <span>{user.langKey.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>System Information</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <label>Created By</label>
                <span>{user.createdBy}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Created Date</label>
                <span>
                  {user.createdDate
                    ? new Date(user.createdDate).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <label>Last Modified By</label>
                <span>{user.lastModifiedBy}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Last Modified Date</label>
                <span>
                  {user.lastModifiedDate
                    ? new Date(user.lastModifiedDate).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Header title="User Details" showBack onBack={handleBack} />
      {renderContent()}
    </div>
  );
};

export default UserDetail;

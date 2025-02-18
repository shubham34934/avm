import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { fetchUserByUsername, updateUser } from "../../reducers/users";
import styles from "./UserDetail.module.css";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import defaultAvatar from "../../assets/images/default-avatar.png";
import { getUserTypeDisplay, getUserTitle } from "../../utils/constants";
import Button from "../../components/Button/Button";

const UserDetail = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    selectedUser: user,
    loading,
    error,
  } = useAppSelector((state) => state.users);

  const [editedUser, setEditedUser] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (username) {
      dispatch(fetchUserByUsername(username));
    }
  }, [dispatch, username]);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleBack = () => {
    if (isEditMode) {
      navigate(`/users/${username}`);
    } else {
      navigate(-1);
    }
  };

  const handleEdit = () => {
    navigate(`/users/${username}?edit=true`);
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaveError(null);
      await dispatch(updateUser(editedUser)).unwrap();
      navigate(`/users/${username}`, { replace: true });
    } catch (error) {
      setSaveError(error);
    }
  };

  const userTypeDisplay = getUserTypeDisplay(user?.authorities);

  const renderEditableField = (label, field, value, type = "text") => (
    <div className={styles.detailItem}>
      <label>{label}</label>
      {isEditMode ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={styles.editInput}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );

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

    if (!user || !editedUser) {
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
            src={editedUser.imageUrl || defaultAvatar}
            alt={getUserTitle(editedUser)}
            className={styles.profileImage}
          />
          <h2 className={styles.userName}>{getUserTitle(editedUser)}</h2>
          <div className={styles.userRole}>{userTypeDisplay}</div>
        </div>

        <div className={styles.detailsContainer}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Information</h2>
            <div className={styles.detailsGrid}>
              {renderEditableField("Username", "login", editedUser.login)}
              {renderEditableField("Email", "email", editedUser.email, "email")}
              {renderEditableField(
                "First Name",
                "firstName",
                editedUser.firstName
              )}
              {renderEditableField(
                "Last Name",
                "lastName",
                editedUser.lastName
              )}
              <div className={styles.detailItem}>
                <label>Status</label>
                {isEditMode ? (
                  <select
                    value={editedUser.activated ? "active" : "inactive"}
                    onChange={(e) =>
                      handleInputChange(
                        "activated",
                        e.target.value === "active"
                      )
                    }
                    className={styles.editInput}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span
                    className={
                      editedUser.activated ? styles.active : styles.inactive
                    }
                  >
                    {editedUser.activated ? "Active" : "Inactive"}
                  </span>
                )}
              </div>
              {renderEditableField("Language", "langKey", editedUser.langKey)}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>System Information</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <label>Created By</label>
                <span>{editedUser.createdBy}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Created Date</label>
                <span>
                  {editedUser.createdDate
                    ? new Date(editedUser.createdDate).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <label>Last Modified By</label>
                <span>{editedUser.lastModifiedBy}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Last Modified Date</label>
                <span>
                  {editedUser.lastModifiedDate
                    ? new Date(editedUser.lastModifiedDate).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {saveError && <div className={styles.errorMessage}>{saveError}</div>}

        <div className={styles.actions}>
          {isEditMode ? (
            <Button onClick={handleSave} variant="primary">
              Save Changes
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Header
        title={isEditMode ? "Edit User" : "User Details"}
        showBack
        onBack={handleBack}
      />
      {renderContent()}
    </div>
  );
};

export default UserDetail;

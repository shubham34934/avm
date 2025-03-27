import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import {
  fetchUserByUsername,
  updateUser,
  uploadUserAvatar,
} from "../../reducers/users";
import styles from "./UserDetail.module.css";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import defaultAvatar from "../../assets/images/default-avatar.png";
import { getUserTypeDisplay, USER_TYPE_DISPLAY } from "../../utils/constants";
import Button from "../../components/Button/Button";
import { toast } from "react-toastify";
import editIcon from "../../assets/icons/edit.svg";
import Tag from "../../components/Tag/Tag";
import AvatarModal from "../../components/AvatarModal/AvatarModal";

const UserDetail = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    selectedUser: user,
    loading,
    error,
    uploadingAvatar,
  } = useAppSelector((state) => state.users);

  const [editedUser, setEditedUser] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    if (username) {
      dispatch(fetchUserByUsername(username));
    }
  }, [dispatch, username]);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
      setPreviewImage(user.imageUrl);
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

  const handleAvatarClick = () => {
    if (isEditMode) {
      setShowAvatarModal(true);
    }
  };

  const handleAvatarModalClose = () => {
    setShowAvatarModal(false);
  };

  const handleAvatarSave = async (data) => {
    try {
      if (data.type === "file") {
        // Handle file upload
        setPreviewImage(URL.createObjectURL(data.file));
        await dispatch(
          uploadUserAvatar({ username, file: data.file })
        ).unwrap();
        toast.success("Avatar uploaded successfully");
      } else if (data.type === "url") {
        // Handle URL update
        setPreviewImage(data.url);
        const updatedUser = {
          ...editedUser,
          imageUrl: data.url,
        };
        await dispatch(updateUser(updatedUser)).unwrap();
        toast.success("Avatar URL updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update avatar");
      // Reset preview if update fails
      setPreviewImage(user?.imageUrl || null);
    }
  };

  const handleSave = async () => {
    try {
      setSaveError(null);
      await dispatch(updateUser(editedUser)).unwrap();
      toast.success("User updated successfully");
      navigate(`/users/${username}`, { replace: true });
    } catch (error) {
      setSaveError(error);
      toast.error("Failed to update user");
    }
  };

  const handleRoleToggle = (role) => {
    if (!isEditMode) return;

    // Ensure authorities is an array
    const currentAuthorities = Array.isArray(editedUser.authorities)
      ? editedUser.authorities
      : [];
    const authorities = [...currentAuthorities];
    const index = authorities.indexOf(role);

    if (index === -1) {
      authorities.push(role);
    } else {
      authorities.splice(index, 1);
    }

    handleInputChange("authorities", authorities);
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
          <div className={styles.avatarContainer} onClick={handleAvatarClick}>
            <img
              src={previewImage || editedUser.imageUrl || defaultAvatar}
              alt={getUserTypeDisplay(editedUser)}
              className={styles.profileImage}
            />
            {isEditMode && (
              <div className={styles.editIconContainer}>
                <img src={editIcon} alt="Edit" className={styles.editIcon} />
              </div>
            )}
          </div>
          {uploadingAvatar && (
            <div className={styles.uploadingIndicator}>Uploading...</div>
          )}

          <h2 className={styles.userName}>{getUserTypeDisplay(editedUser)}</h2>

          <div className={styles.roleTags}>
            {Object.entries(USER_TYPE_DISPLAY).map(([role, label]) => {
              const authorities = Array.isArray(editedUser.authorities)
                ? editedUser.authorities
                : [];
              const isActive = authorities.includes(role);
              
              // Only show active roles when not in edit mode
              if (!isEditMode && !isActive) return null;
              
              return (
                <div
                  key={role}
                  className={`${styles.roleTagWrapper} ${
                    isEditMode ? styles.editable : ""
                  }`}
                  onClick={() => handleRoleToggle(role)}
                >
                  <Tag
                    text={label}
                    variant={isActive ? "active" : "inactive"}
                    size="medium"
                  />
                  {isEditMode && isActive && (
                    <span className={styles.removeIcon}>×</span>
                  )}
                </div>
              );
            })}
          </div>
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
            <Button
              onClick={handleSave}
              variant="primary"
              style={{ width: "100%" }}
            >
              Save Changes
            </Button>
          ) : (
            <></>
          )}
        </div>

        {showAvatarModal && (
          <AvatarModal
            isOpen={showAvatarModal}
            onClose={handleAvatarModalClose}
            onSave={handleAvatarSave}
            currentImageUrl={editedUser.imageUrl}
          />
        )}
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

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
import { usePermissions } from "../../hooks/usePermissions";
import { USER_ROLES } from "../../utils/constants";
import CreatorRoleModal from '../../components/Modals/CreatorRoleModal';
import { createVideoUser, deleteVideoUser } from '../../reducers/videoUsers';

const UserDetail = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { userRole } = usePermissions();
  const [activeTab, setActiveTab] = useState('profile');

  // Check if edit button should be visible (not visible for ROLE_CREATOR and ROLE_USER)
  const showEditButton = userRole !== USER_ROLES.CREATOR && userRole !== USER_ROLES.USER;

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
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [creatorModalMode, setCreatorModalMode] = useState('add');
  const [showVideoUserModal, setShowVideoUserModal] = useState(false);
  const [pendingVideoUserData, setPendingVideoUserData] = useState(null);

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

  const handleRoleToggle = (role) => {
    if (!isEditMode) return;

    const newAuthorities = [...editedUser.authorities];
    const roleIndex = newAuthorities.indexOf(role);

    if (roleIndex === -1) {
      newAuthorities.push(role);
    } else {
      newAuthorities.splice(roleIndex, 1);
    }

    setEditedUser({
      ...editedUser,
      authorities: newAuthorities,
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Check if creator role was added or removed
      const hasCreatorRole = editedUser.authorities.includes(USER_ROLES.CREATOR);
      const hadCreatorRole = user.authorities.includes(USER_ROLES.CREATOR);

      if (hasCreatorRole !== hadCreatorRole) {
        // Show modal for video user creation/deletion
        setCreatorModalMode(hasCreatorRole ? 'add' : 'remove');
        setShowCreatorModal(true);
        return;
      }

      // If no creator role change, just update user
      await dispatch(updateUser({ login: editedUser.login, ...editedUser })).unwrap();
      toast.success('User updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleCreatorModalConfirm = async (phoneNumber) => {
    try {
      if (creatorModalMode === 'add') {
        // Create video user first
        await dispatch(createVideoUser({
          userId: editedUser.id.toString(),
          userName: editedUser.login,
          name: `${editedUser.firstName || ''} ${editedUser.lastName || ''}`.trim(),
          phone: phoneNumber,
          email: editedUser.email
        })).unwrap();
        toast.success("Video user created successfully");
      } else {
        // Delete video user first
        await dispatch(deleteVideoUser(editedUser.id.toString())).unwrap();
        toast.success("Video user deleted successfully");
      }

      // After video user operation, update the user
      await dispatch(updateUser({ login: editedUser.login, ...editedUser })).unwrap();
      toast.success('User updated successfully');
      
      setShowCreatorModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleVideoUserConfirm = async (phoneNumber) => {
    try {
      await dispatch(createVideoUser({
        ...pendingVideoUserData,
        phone: phoneNumber
      })).unwrap();
      
      toast.success('Video user created successfully');
      setShowVideoUserModal(false);
      setPendingVideoUserData(null);
    } catch (error) {
      toast.error(error.message || 'Failed to create video user');
    }
  };

  const renderProfileInfo = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3>Account Information</h3>
        <div className={styles.detailsGrid}>
          {renderEditableField("Username", "login", editedUser.login)}
          {renderEditableField("Email", "email", editedUser.email, "email")}
          {renderEditableField("First Name", "firstName", editedUser.firstName)}
          {renderEditableField("Last Name", "lastName", editedUser.lastName)}
          <div className={styles.detailItem}>
            <label>Status</label>
            {isEditMode ? (
              <select
                value={editedUser.activated ? "active" : "inactive"}
                onChange={(e) =>
                  handleInputChange("activated", e.target.value === "active")
                }
                className={styles.editInput}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            ) : (
              <span className={editedUser.activated ? styles.active : styles.inactive}>
                {editedUser.activated ? "Active" : "Inactive"}
              </span>
            )}
          </div>
          {renderEditableField("Language", "langKey", editedUser.langKey)}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Bank Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>Account Name</label>
            {isEditMode ? (
              <input
                type="text"
                value={editedUser.bankDetails?.accountName || ''}
                onChange={(e) => handleInputChange('bankDetails', {
                  ...editedUser.bankDetails,
                  accountName: e.target.value
                })}
                className={styles.editInput}
              />
            ) : (
              <span>{editedUser.bankDetails?.accountName || 'Not provided'}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <label>Account Number</label>
            {isEditMode ? (
              <input
                type="text"
                value={editedUser.bankDetails?.accountNo || ''}
                onChange={(e) => handleInputChange('bankDetails', {
                  ...editedUser.bankDetails,
                  accountNo: e.target.value
                })}
                className={styles.editInput}
              />
            ) : (
              <span>{editedUser.bankDetails?.accountNo || 'Not provided'}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <label>Bank Name</label>
            {isEditMode ? (
              <input
                type="text"
                value={editedUser.bankDetails?.bankName || ''}
                onChange={(e) => handleInputChange('bankDetails', {
                  ...editedUser.bankDetails,
                  bankName: e.target.value
                })}
                className={styles.editInput}
              />
            ) : (
              <span>{editedUser.bankDetails?.bankName || 'Not provided'}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <label>IFSC Code</label>
            {isEditMode ? (
              <input
                type="text"
                value={editedUser.bankDetails?.ifsc || ''}
                onChange={(e) => handleInputChange('bankDetails', {
                  ...editedUser.bankDetails,
                  ifsc: e.target.value
                })}
                className={styles.editInput}
              />
            ) : (
              <span>{editedUser.bankDetails?.ifsc || 'Not provided'}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <label>Proof URL</label>
            {isEditMode ? (
              <input
                type="url"
                value={editedUser.bankDetails?.proofUrl || ''}
                onChange={(e) => handleInputChange('bankDetails', {
                  ...editedUser.bankDetails,
                  proofUrl: e.target.value
                })}
                className={styles.editInput}
              />
            ) : (
              <span>{editedUser.bankDetails?.proofUrl || 'Not provided'}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <label>UPI Handle</label>
            {isEditMode ? (
              <input
                type="text"
                value={editedUser.bankDetails?.upiHandle || ''}
                onChange={(e) => handleInputChange('bankDetails', {
                  ...editedUser.bankDetails,
                  upiHandle: e.target.value
                })}
                className={styles.editInput}
              />
            ) : (
              <span>{editedUser.bankDetails?.upiHandle || 'Not provided'}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <label>Status</label>
            {isEditMode ? (
              <select
                value={editedUser.bankDetails?.isActive ? 'active' : 'inactive'}
                onChange={(e) => handleInputChange('bankDetails', {
                  ...editedUser.bankDetails,
                  isActive: e.target.value === 'active'
                })}
                className={styles.editInput}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            ) : (
              <span className={editedUser.bankDetails?.isActive ? styles.active : styles.inactive}>
                {editedUser.bankDetails?.isActive ? 'Active' : 'Inactive'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>System Information</h3>
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
  );

  const renderCampaigns = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3>Campaigns</h3>
        <div className={styles.campaignsGrid}>
          {user?.campaigns?.length > 0 ? (
            user.campaigns.map((campaign, index) => (
              <div key={index} className={styles.campaignCard}>
                <div className={styles.campaignInfo}>
                  <h4>{campaign.name}</h4>
                  <p>{campaign.description}</p>
                  <div className={styles.campaignStats}>
                    <span>Status: {campaign.status}</span>
                    <span>Start Date: {new Date(campaign.startDate).toLocaleDateString()}</span>
                    <span>End Date: {new Date(campaign.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noCampaigns}>
              <p>No campaigns found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVideos = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3>Videos</h3>
        <div className={styles.videosGrid}>
          {user?.videos?.length > 0 ? (
            user.videos.map((video, index) => (
              <div key={index} className={styles.videoCard}>
                <div className={styles.videoThumbnail}>
                  <img src={video.thumbnailUrl} alt={video.title} />
                </div>
                <div className={styles.videoInfo}>
                  <h4>{video.title}</h4>
                  <p>{video.description}</p>
                  <div className={styles.videoStats}>
                    <span>Views: {video.views}</span>
                    <span>Likes: {video.likes}</span>
                    <span>Uploaded: {new Date(video.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noVideos}>
              <p>No videos uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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

        <div className={styles.tabsContainer}>
          <div className={styles.tabList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Info
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'campaigns' ? styles.active : ''}`}
              onClick={() => setActiveTab('campaigns')}
            >
              Campaigns
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'videos' ? styles.active : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'profile' && renderProfileInfo()}
            {activeTab === 'campaigns' && renderCampaigns()}
            {activeTab === 'videos' && renderVideos()}
          </div>
        </div>

        {saveError && <div className={styles.errorMessage}>{saveError}</div>}

        {activeTab === 'profile' && (
          <div className={styles.actions}>
            {isEditMode ? (
              <Button
                onClick={handleSaveChanges}
                variant="primary"
                style={{ width: "100%" }}
              >
                Save Changes
              </Button>
            ) : (
              showEditButton && (
                <Button
                  onClick={handleEdit}
                  variant="secondary"
                  style={{ width: "100%" }}
                  className={styles.editButton}
                >
                  <img src={editIcon} alt="" className={styles.buttonIcon} />
                  Edit Profile
                </Button>
              )
            )}
          </div>
        )}

        {showCreatorModal && (
          <CreatorRoleModal
            isOpen={showCreatorModal}
            onClose={() => setShowCreatorModal(false)}
            onConfirm={handleCreatorModalConfirm}
            mode={creatorModalMode}
          />
        )}

        {showAvatarModal && (
          <AvatarModal
            isOpen={showAvatarModal}
            onClose={handleAvatarModalClose}
            onSave={handleAvatarSave}
            currentImageUrl={editedUser.imageUrl}
          />
        )}

        {showVideoUserModal && (
          <CreatorRoleModal
            isOpen={showVideoUserModal}
            onClose={() => {
              setShowVideoUserModal(false);
              setPendingVideoUserData(null);
            }}
            onConfirm={handleVideoUserConfirm}
            mode="add"
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

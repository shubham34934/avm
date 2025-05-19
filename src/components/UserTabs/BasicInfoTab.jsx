import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../config/store';
import { updateUser } from '../../reducers/users';
import { toast } from 'react-toastify';
import Button from '../Button/Button';
import editIcon from '../../assets/icons/edit.svg';
import styles from './UserTabs.module.css';

const BasicInfoTab = ({ user, isEditModeFromRoute }) => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(isEditModeFromRoute);
  const [editedData, setEditedData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    login: user?.login || '',
    activated: user?.activated || false,
  });

  useEffect(() => {
    setEditedData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      login: user?.login || '',
      activated: user?.activated || false,
    });
  }, [user]);

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...user,
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        email: editedData.email,
        login: editedData.login,
        activated: editedData.activated,
      };

      await dispatch(updateUser(payload)).unwrap();
      toast.success('Changes saved successfully');
      setIsEditMode(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save changes');
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h3>Basic Information</h3>
        <Button
          variant="secondary"
          onClick={() => setIsEditMode(!isEditMode)}
          className={styles.editButton}
        >
          <img src={editIcon} alt="" className={styles.buttonIcon} />
          {isEditMode ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <label>Username</label>
          {isEditMode ? (
            <input
              type="text"
              value={editedData.login}
              onChange={(e) => handleInputChange('login', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.login}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>Email</label>
          {isEditMode ? (
            <input
              type="email"
              value={editedData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.email}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>First Name</label>
          {isEditMode ? (
            <input
              type="text"
              value={editedData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.firstName}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>Last Name</label>
          {isEditMode ? (
            <input
              type="text"
              value={editedData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.lastName}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>Status</label>
          {isEditMode ? (
            <select
              value={editedData.activated ? 'active' : 'inactive'}
              onChange={(e) => handleInputChange('activated', e.target.value === 'active')}
              className={styles.input}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : (
            <span className={editedData.activated ? styles.active : styles.inactive}>
              {editedData.activated ? 'Active' : 'Inactive'}
            </span>
          )}
        </div>
      </div>
      {isEditMode && (
        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={handleSave}
            className={styles.saveButton}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default BasicInfoTab; 
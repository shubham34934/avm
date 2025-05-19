import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../config/store';
import { updateUser } from '../../reducers/users';
import { toast } from 'react-toastify';
import Button from '../Button/Button';
import editIcon from '../../assets/icons/edit.svg';
import styles from './UserTabs.module.css';

const BankDetailsTab = ({ user, isEditModeFromRoute }) => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(isEditModeFromRoute);
  const [editedData, setEditedData] = useState({
    accountName: user?.bankDetails?.accountName || '',
    accountNo: user?.bankDetails?.accountNo || '',
    bankName: user?.bankDetails?.bankName || '',
    ifsc: user?.bankDetails?.ifsc || '',
    proofUrl: user?.bankDetails?.proofUrl || '',
    upiHandle: user?.bankDetails?.upiHandle || '',
    isActive: user?.bankDetails?.isActive || false,
  });

  useEffect(() => {
    setEditedData({
      accountName: user?.bankDetails?.accountName || '',
      accountNo: user?.bankDetails?.accountNo || '',
      bankName: user?.bankDetails?.bankName || '',
      ifsc: user?.bankDetails?.ifsc || '',
      proofUrl: user?.bankDetails?.proofUrl || '',
      upiHandle: user?.bankDetails?.upiHandle || '',
      isActive: user?.bankDetails?.isActive || false,
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
        bankDetails: {
          ...user?.bankDetails,
          accountName: editedData.accountName,
          accountNo: editedData.accountNo,
          bankName: editedData.bankName,
          ifsc: editedData.ifsc,
          proofUrl: editedData.proofUrl,
          upiHandle: editedData.upiHandle,
          isActive: editedData.isActive,
        }
      };

      await dispatch(updateUser(payload)).unwrap();
      toast.success('Bank details saved successfully');
      setIsEditMode(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save bank details');
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h3>Bank Details</h3>
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
          <label>Account Name</label>
          {isEditMode ? (
            <input
              type="text"
              value={editedData.accountName}
              onChange={(e) => handleInputChange('accountName', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.accountName || 'Not provided'}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>Account Number</label>
          {isEditMode ? (
            <input
              type="text"
              value={editedData.accountNo}
              onChange={(e) => handleInputChange('accountNo', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.accountNo || 'Not provided'}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>Bank Name</label>
          {isEditMode ? (
            <input
              type="text"
              value={editedData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.bankName || 'Not provided'}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>IFSC Code</label>
          {isEditMode ? (
            <input
              type="text"
              value={editedData.ifsc}
              onChange={(e) => handleInputChange('ifsc', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.ifsc || 'Not provided'}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>Proof URL</label>
          {isEditMode ? (
            <input
              type="url"
              value={editedData.proofUrl}
              onChange={(e) => handleInputChange('proofUrl', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.proofUrl || 'Not provided'}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>UPI Handle</label>
          {isEditMode ? (
            <input
              type="text"
              value={editedData.upiHandle}
              onChange={(e) => handleInputChange('upiHandle', e.target.value)}
              className={styles.input}
            />
          ) : (
            <span>{editedData.upiHandle || 'Not provided'}</span>
          )}
        </div>
        <div className={styles.infoItem}>
          <label>Status</label>
          {isEditMode ? (
            <select
              value={editedData.isActive ? 'active' : 'inactive'}
              onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
              className={styles.input}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : (
            <span className={editedData.isActive ? styles.active : styles.inactive}>
              {editedData.isActive ? 'Active' : 'Inactive'}
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

export default BankDetailsTab; 
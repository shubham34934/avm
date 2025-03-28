import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import {
  createBrand,
  fetchBrandById,
  updateBrand,
} from "../../reducers/brands";
import { fetchUsers } from "../../reducers/users";
import { toast } from "react-toastify";
import styles from "./CreateSponsor.module.css";
import Button from "../../components/Button/Button";
import backIcon from "../../assets/icons/back.svg";
import { useUser } from "../../hooks/useUser";
import { debounce } from "lodash";

const CreateSponsor = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const sponsorId = searchParams.get("id");
  const { users } = useAppSelector((state) => state.users);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedAdminUsers, setSelectedAdminUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [formData, setFormData] = useState({
    sponsorName: "",
    sponsorDescription: "",
    sponsorBanner1Url: "",
    sponsorBanner2Url: "",
    sponsorBanner3Url: "",
    sponsorExternalUrl: "",
    sponsorLogoUrl: "",
    isActive: true,
  });

  // Get today's date in YYYY-MM-DD format
  const today = useMemo(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    const fetchSponsorData = async () => {
      if (isEdit && sponsorId) {
        try {
          const sponsor = await dispatch(
            fetchBrandById(parseInt(sponsorId))
          ).unwrap();

          setFormData({
            sponsorName: sponsor.sponsorName || "",
            sponsorDescription: sponsor.sponsorDescription || "",
            sponsorBanner1Url: sponsor.sponsorBanner1Url || "",
            sponsorBanner2Url: sponsor.sponsorBanner2Url || "",
            sponsorBanner3Url: sponsor.sponsorBanner3Url || "",
            sponsorExternalUrl: sponsor.sponsorExternalUrl || "",
            sponsorLogoUrl: sponsor.sponsorLogoUrl || "",
            isActive: sponsor.isActive !== undefined ? sponsor.isActive : true,
          });

          // Set selected admin users if available
          if (sponsor.adminUsers && Array.isArray(sponsor.adminUsers)) {
            setSelectedAdminUsers(sponsor.adminUsers);
          }
        } catch (error) {
          toast.error("Failed to fetch sponsor details");
          navigate("/brands");
        }
      }
    };

    fetchSponsorData();
  }, [isEdit, sponsorId, dispatch, navigate]);

  const debouncedSearchUsers = useMemo(
    () =>
      debounce((query) => {
        if (query.trim().length > 0) {
          dispatch(fetchUsers({ page: 0, size: 10 }));
        }
      }, 300),
    [dispatch]
  );

  useEffect(() => {
    if (userSearchQuery) {
      debouncedSearchUsers(userSearchQuery);
    }
    return () => debouncedSearchUsers.cancel();
  }, [userSearchQuery, debouncedSearchUsers]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserSearch = (e) => {
    const query = e.target.value;
    setUserSearchQuery(query);
    setShowUserDropdown(query.trim().length > 0);
  };

  const handleSelectUser = (user) => {
    if (!selectedAdminUsers.some((u) => u.id === user.id)) {
      setSelectedAdminUsers([...selectedAdminUsers, user]);
    }
    setUserSearchQuery("");
    setShowUserDropdown(false);
  };

  const handleRemoveUser = (userId) => {
    setSelectedAdminUsers(selectedAdminUsers.filter((u) => u.id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentDate = new Date().toISOString().split("T")[0];

      const payload = {
        sponsorName: formData.sponsorName,
        sponsorDescription: formData.sponsorDescription,
        sponsorBanner1Url: formData.sponsorBanner1Url,
        sponsorBanner2Url: formData.sponsorBanner2Url,
        sponsorBanner3Url: formData.sponsorBanner3Url,
        sponsorExternalUrl: formData.sponsorExternalUrl,
        sponsorLogoUrl: formData.sponsorLogoUrl,
        isActive: formData.isActive,
        adminUsers: selectedAdminUsers.map((user) => ({ id: user.id })),
      };

      if (isEdit && sponsorId) {
        // Add id, updatedBy and updatedOn fields for edit
        payload.id = parseInt(sponsorId);
        payload.updatedBy = user?.login || "unknown";
        payload.updatedOn = currentDate;

        await dispatch(
          updateBrand({ id: parseInt(sponsorId), data: payload })
        ).unwrap();
        toast.success("Sponsor updated successfully");
      } else {
        // Add createdBy and createdOn fields for new sponsor
        payload.createdBy = user?.login || "unknown";
        payload.createdOn = currentDate;

        await dispatch(createBrand(payload)).unwrap();
        toast.success("Sponsor created successfully");
      }
      navigate("/brands");
    } catch (error) {
      toast.error(
        error.message || `Failed to ${isEdit ? "update" : "create"} sponsor`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          onClick={handleBack}
          className={styles.backButton}
          variant="icon"
        >
          <img src={backIcon} alt="Back" />
        </Button>
        <h1 className={styles.title}>
          {isEdit ? "Edit Sponsor" : "Create Sponsor"}
        </h1>
      </div>

      <p className={styles.description}>
        {isEdit
          ? "Update your sponsor details below."
          : "Add a new sponsor by filling out the details below."}
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            type="text"
            id="sponsorName"
            name="sponsorName"
            value={formData.sponsorName}
            onChange={handleChange}
            placeholder="Sponsor Name"
            className={styles.input}
            required
          />
          <span className={styles.required}>*</span>
        </div>

        <div className={styles.formGroup}>
          <textarea
            id="sponsorDescription"
            name="sponsorDescription"
            value={formData.sponsorDescription}
            onChange={handleChange}
            placeholder="Sponsor Description"
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="url"
            id="sponsorLogoUrl"
            name="sponsorLogoUrl"
            value={formData.sponsorLogoUrl}
            onChange={handleChange}
            placeholder="Logo URL"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="url"
            id="sponsorBanner1Url"
            name="sponsorBanner1Url"
            value={formData.sponsorBanner1Url}
            onChange={handleChange}
            placeholder="Banner 1 URL"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="url"
            id="sponsorBanner2Url"
            name="sponsorBanner2Url"
            value={formData.sponsorBanner2Url}
            onChange={handleChange}
            placeholder="Banner 2 URL"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="url"
            id="sponsorBanner3Url"
            name="sponsorBanner3Url"
            value={formData.sponsorBanner3Url}
            onChange={handleChange}
            placeholder="Banner 3 URL"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="url"
            id="sponsorExternalUrl"
            name="sponsorExternalUrl"
            value={formData.sponsorExternalUrl}
            onChange={handleChange}
            placeholder="External Website URL"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="isActive" className={styles.checkboxLabel}>
              Active Sponsor
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.adminUsersSection}>
            <label className={styles.sectionLabel}>Admin Users</label>

            <div className={styles.userSearchContainer}>
              <input
                type="text"
                placeholder="Search users..."
                value={userSearchQuery}
                onChange={handleUserSearch}
                className={styles.input}
              />

              {showUserDropdown && users.length > 0 && (
                <div className={styles.userDropdown}>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={styles.userOption}
                      onClick={() => handleSelectUser(user)}
                    >
                      {user.firstName} {user.lastName} ({user.login})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedAdminUsers.length > 0 && (
              <div className={styles.selectedUsers}>
                {selectedAdminUsers.map((user) => (
                  <div key={user.id} className={styles.userTag}>
                    <span>
                      {user.firstName} {user.lastName} ({user.login})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user.id)}
                      className={styles.removeUserBtn}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
            variant="primary"
            fullWidth
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Sponsor"
              : "Create Sponsor"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSponsor;

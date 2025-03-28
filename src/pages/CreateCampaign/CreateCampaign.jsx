import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../config/store";
import {
  createCompetition,
  fetchCompetitionById,
  updateCompetition,
} from "../../reducers/competitions";
import { fetchBrands } from "../../reducers/brands";
import { toast } from "react-toastify";
import styles from "./CreateCampaign.module.css";
import calendarIcon from "../../assets/icons/calendar.svg";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/Button/Button";
import backIcon from "../../assets/icons/back.svg";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const campaignId = searchParams.get("id");
  const { brands } = useAppSelector((state) => state.brands);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sponsor: {},
    startDate: "",
    endDate: "",
    prizeAmount: "",
    rules: "",
  });

  // Get today's date in YYYY-MM-DD format
  const today = useMemo(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    // Fetch brands for sponsor dropdown
    dispatch(fetchBrands());

    const fetchCampaignData = async () => {
      if (isEdit && campaignId) {
        try {
          const campaign = await dispatch(
            fetchCompetitionById(parseInt(campaignId))
          ).unwrap();

          setFormData({
            name: campaign.title || "",
            sponsor: campaign.sponsor || {},
            startDate: campaign.startDate || "",
            endDate: campaign.endDate || "",
            prizeAmount: campaign.totalPrizeValue?.toString() || "",
            rules: campaign.description || "",
          });
        } catch (error) {
          toast.error("Failed to load campaign data");
          navigate("/campaign");
        }
      }
    };

    fetchCampaignData();
  }, [dispatch, isEdit, campaignId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for dates
    if (name === "startDate") {
      // Calculate minimum end date (1 day after start date)
      const startDate = new Date(value);
      const minEndDate = new Date(startDate);
      minEndDate.setDate(startDate.getDate() + 1);
      const minEndDateStr = minEndDate.toISOString().split("T")[0];

      // Reset end date if start date changes or if current end date is now invalid
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        endDate:
          prev.endDate && new Date(prev.endDate) <= startDate
            ? ""
            : prev.endDate,
      }));
    } else if (name === "sponsorId") {
      const selectedBrand = brands.find(
        (brand) => brand.id === parseInt(value)
      );
      setFormData((prev) => ({
        ...prev,
        sponsor: selectedBrand || {},
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentDate = new Date().toISOString().split("T")[0];

      // Validate dates
      if (new Date(formData.startDate) < new Date(currentDate)) {
        toast.error("Start date cannot be in the past");
        setIsSubmitting(false);
        return;
      }

      // Calculate minimum end date (1 day after start date)
      const startDate = new Date(formData.startDate);
      const minEndDate = new Date(startDate);
      minEndDate.setDate(startDate.getDate() + 1);

      if (new Date(formData.endDate) < minEndDate) {
        toast.error("End date must be at least one day after start date");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: formData.name,
        description: formData.rules,
        sponsor: formData.sponsor,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrizeValue: parseFloat(formData.prizeAmount),
        rules: formData.rules,
        status: "Draft",
        paymentStatus: "PaymentPendingFromSponsor",
        isActive: true,
        isBlocked: false,
        isPaused: false,
      };

      if (isEdit && campaignId) {
        // Add updatedBy and updatedOn fields for edit
        payload.updatedBy = user?.login || "unknown";
        payload.updatedOn = currentDate;

        await dispatch(
          updateCompetition({ id: parseInt(campaignId), data: payload })
        ).unwrap();
        toast.success("Campaign updated successfully");
      } else {
        // Add createdBy and createdOn fields for new campaign
        payload.createdBy = user?.login || "unknown";
        payload.createdOn = currentDate;

        await dispatch(createCompetition(payload)).unwrap();
        toast.success("Campaign created successfully");
      }
      navigate("/campaign");
    } catch (error) {
      toast.error(
        error.message || `Failed to ${isEdit ? "update" : "create"} campaign`
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
        <Button onClick={handleBack} className={styles.backButton}>
          <img src={backIcon} alt="Back" />
        </Button>
        <h1 className={styles.title}>
          {isEdit ? "Edit Campaign" : "Create Campaign"}
        </h1>
      </div>

      <p className={styles.description}>
        {isEdit
          ? "Update your campaign details below."
          : "Start a campaign by sharing your goals, content needs, and rewards to get creators involved."}
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className={styles.input}
            required
          />
          <span className={styles.required}>*</span>
        </div>

        <div className={styles.formGroup}>
          <select
            id="sponsorId"
            name="sponsorId"
            value={formData.sponsor?.id || ""}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Select Sponsor (Optional)</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.sponsorName || brand.name || "Unnamed Sponsor"}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.dateInputWrapper}>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={today}
              className={styles.dateInput}
              required
            />
            <img
              src={calendarIcon}
              alt="Calendar"
              className={styles.calendarIcon}
            />
          </div>
          <span className={styles.required}>*</span>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.dateInputWrapper}>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={
                formData.startDate
                  ? (() => {
                      const minDate = new Date(formData.startDate);
                      minDate.setDate(minDate.getDate() + 1);
                      return minDate.toISOString().split("T")[0];
                    })()
                  : today
              }
              className={styles.dateInput}
              required
            />
            <img
              src={calendarIcon}
              alt="Calendar"
              className={styles.calendarIcon}
            />
          </div>
          <span className={styles.required}>*</span>
        </div>

        <div className={styles.formGroup}>
          <input
            type="number"
            id="prizeAmount"
            name="prizeAmount"
            value={formData.prizeAmount}
            onChange={handleChange}
            placeholder="Prize Amount"
            className={styles.input}
            required
            min="0"
            step="0.01"
          />
          <span className={styles.required}>*</span>
        </div>

        <div className={styles.formGroup}>
          <textarea
            id="rules"
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            placeholder="Rules and Guidelines"
            className={styles.textarea}
            required
          />
          <span className={styles.required}>*</span>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Campaign"
              : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;

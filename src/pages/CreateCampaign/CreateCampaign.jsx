import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../config/store";
import {
  createCompetition,
  fetchCompetitionById,
  updateCompetition,
} from "../../reducers/competitions";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    topic: "",
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
    const fetchCampaignData = async () => {
      if (isEdit && campaignId) {
        try {
          const campaign = await dispatch(
            fetchCompetitionById(parseInt(campaignId))
          ).unwrap();
          setFormData({
            name: campaign.title,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            prizeAmount: campaign.totalPrizeValue.toString(),
            rules: campaign.description,
          });
        } catch (error) {
          toast.error("Failed to fetch campaign details");
          navigate("/campaign");
        }
      }
    };

    fetchCampaignData();
  }, [isEdit, campaignId, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for dates
    if (name === "startDate") {
      // Reset end date if start date changes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        endDate: "", // Reset end date when start date changes
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

      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        toast.error("End date must be after start date");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: formData.name,
        description: formData.rules,
        topic: formData.topic,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrizeValue: parseFloat(formData.prizeAmount),
        rules: formData.rules,
        status: "Draft",
        paymentStatus: "PaymentPendingFromSponsor",
        isActive: true,
        isBlocked: false,
        isPaused: false,
        createdBy: user?.login || "unknown",
        createdOn: currentDate,
      };

      if (isEdit && campaignId) {
        await dispatch(
          updateCompetition({ id: parseInt(campaignId), data: payload })
        ).unwrap();
        toast.success("Campaign updated successfully");
      } else {
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
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="" disabled>
              Topic
            </option>
            <option value="technology">Technology</option>
            <option value="fashion">Fashion</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
          </select>
          <span className={styles.required}>*</span>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.dateInput}>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="Start Date"
              className={styles.input}
              min={today}
              required
            />
            <img
              src={calendarIcon}
              alt="Calendar"
              className={styles.calendarIcon}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.dateInput}>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="End Date"
              className={styles.input}
              min={formData.startDate || today}
              required
              disabled={!formData.startDate}
            />
            <img
              src={calendarIcon}
              alt="Calendar"
              className={styles.calendarIcon}
            />
          </div>
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
            min="0"
            required
          />
          <span className={styles.required}>*</span>
        </div>

        <div className={styles.formGroup}>
          <textarea
            id="rules"
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            placeholder="Campaign Rules"
            className={styles.textarea}
            rows="4"
            required
          />
          <span className={styles.required}>*</span>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isEdit ? "Update Campaign" : "Create Campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;

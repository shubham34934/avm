import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../config/store";
import { createCompetition } from "../../reducers/competitions";
import { toast } from "react-toastify";
import styles from "./CreateCampaign.module.css";
import calendarIcon from "../../assets/icons/calendar.svg";
import { useUser } from "../../hooks/useUser";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    startDate: "",
    endDate: "",
    prizeAmount: "",
    rules: "",
  });

  console.log({ user });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current date for createdOn
      const currentDate = new Date().toISOString().split("T")[0];
      console.log({ user });
      // Map form data to API payload
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

      await dispatch(createCompetition(payload)).unwrap();
      toast.success("Campaign created successfully");
      navigate("/campaign");
    } catch (error) {
      toast.error(error.message || "Failed to create campaign");
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
        <button onClick={handleBack} className={styles.backButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className={styles.title}>Create Campaign</h1>
      </div>

      <p className={styles.description}>
        Start a campaign by sharing your goals, content needs, and rewards to
        get creators involved.
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
            placeholder="Rules & Guardrails"
            className={styles.textarea}
            required
          />
          <span className={styles.required}>*</span>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;

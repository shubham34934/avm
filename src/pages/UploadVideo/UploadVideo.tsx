import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../config/store";
import { toast } from "react-toastify";
import styles from "./CreateVideoPost.module.css";

// Topics for video posts
const VIDEO_TOPICS = [
  "Entertainment",
  "Education",
  "Sports",
  "Technology",
  "Lifestyle",
  "Music",
  "Travel",
  "Comedy",
  "Other",
];

// URL types
const URL_TYPES = [
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "localUpload", label: "Local Video Upload" },
];

const CreateVideoPost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    urlType: "youtube",
    topic: "",
    localFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;

    if (name === "localFile" && files) {
      setFormData((prev) => ({
        ...prev,
        localFile: files[0],
        videoUrl: files[0] ? files[0].name : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.title.trim()) {
        toast.error("Please enter a title");
        setIsSubmitting(false);
        return;
      }

      if (!formData.videoUrl.trim()) {
        toast.error("Please provide a video URL or upload a local video");
        setIsSubmitting(false);
        return;
      }

      // Prepare payload
      const payload = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        urlType: formData.urlType,
        topic: formData.topic,
      };

      // If local file, handle file upload
      if (formData.localFile) {
        // Implement file upload logic here
        // This might involve using a file upload service or API
        // For now, just log the file
        console.log("Local file to upload:", formData.localFile);
      }

      // Dispatch action to create video post
      // await dispatch(createVideoPost(payload)).unwrap();

      toast.success("Video post created successfully");
      navigate("/videos");
    } catch (error) {
      toast.error(error.message || "Failed to create video post");
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
        <h1 className={styles.title}>Create Video Post</h1>
      </div>

      <p className={styles.description}>
        Share your video with our community. Fill in the details below.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Video Title"
            className={styles.input}
            required
          />
          <span className={styles.required}>*</span>
        </div>

        <div className={styles.formGroup}>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Video Description (Optional)"
            className={styles.textarea}
            rows="4"
          />
        </div>

        <div className={styles.formGroup}>
          <select
            id="urlType"
            name="urlType"
            value={formData.urlType}
            onChange={handleChange}
            className={styles.select}
            required
          >
            {URL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {formData.urlType !== "localUpload" && (
          <div className={styles.formGroup}>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="Video URL"
              className={styles.input}
              required
            />
            <span className={styles.required}>*</span>
          </div>
        )}

        {formData.urlType === "localUpload" && (
          <div className={styles.formGroup}>
            <input
              type="file"
              id="localFile"
              name="localFile"
              accept="video/*"
              onChange={handleChange}
              className={styles.fileInput}
              required
            />
            <span className={styles.required}>*</span>
          </div>
        )}

        <div className={styles.formGroup}>
          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select Topic</option>
            {VIDEO_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <span className={styles.required}>*</span>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Video Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateVideoPost;

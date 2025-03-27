import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../config/store";
import { toast } from "react-toastify";
import styles from "./UploadVideo.module.css";
import Button from "../../components/Button/Button";
import backIcon from "../../assets/icons/back.svg";
import { uploadVideoPost } from "../../reducers/videoPosts";
import { useUser } from "../../hooks/useUser";

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
  { value: "YouTube", label: "YouTube" },
  { value: "Instagram", label: "Instagram" },
  { value: "LocalVideoUpload", label: "Local Video Upload" },
];

const CreateVideoPost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user }: any = useUser();

  // Extract campaign ID from query params
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get("campaignId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    urlType: "YouTube",
    topic: "",
    localFile: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;

      if (type === "file") {
        const fileInput = e.target as HTMLInputElement;
        const files = fileInput.files;
        if (files && files.length > 0) {
          setFormData((prev) => ({
            ...prev,
            localFile: files[0],
            videoUrl: files[0].name,
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  const validateVideoUrl = (url: string, urlType: string): boolean => {
    // Remove leading/trailing whitespace
    url = url.trim();

    // YouTube URL validation
    const youtubeRegex =
      /^(https?\:\/\/)?(www\.youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    // Instagram URL validation (basic pattern)
    const instagramRegex =
      /^(https?\:\/\/)?(www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/;

    switch (urlType) {
      case "YouTube":
        return youtubeRegex.test(url);
      case "Instagram":
        return instagramRegex.test(url);
      default:
        return true; // For local upload, no URL validation needed
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.title.trim()) {
        toast.error("Please enter a title");
        setIsSubmitting(false);
        return;
      }

      // Validate user
      if (!user || !user.id) {
        toast.error("Please log in to upload a video");
        setIsSubmitting(false);
        return;
      }

      // URL validation for non-local upload
      if (formData.urlType !== "localUpload") {
        if (!formData.videoUrl.trim()) {
          toast.error("Please provide a video URL");
          setIsSubmitting(false);
          return;
        }

        if (!validateVideoUrl(formData.videoUrl, formData.urlType)) {
          toast.error(
            `Please enter a valid ${
              formData.urlType === "YouTube" ? "YouTube" : "Instagram"
            } video URL`
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Local file validation
      if (formData.urlType === "localUpload") {
        if (!formData.localFile) {
          toast.error("Please upload a local video file");
          setIsSubmitting(false);
          return;
        }

        // Optional: File size and type validation
        const maxFileSize = 100 * 1024 * 1024; // 100 MB
        const allowedTypes = ["video/mp4", "video/mpeg", "video/quicktime"];

        if (formData.localFile.size > maxFileSize) {
          toast.error("File is too large. Maximum file size is 100 MB.");
          setIsSubmitting(false);
          return;
        }

        if (!allowedTypes.includes(formData.localFile.type)) {
          toast.error(
            "Invalid file type. Please upload MP4, MPEG, or QuickTime videos."
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare payload
      const payload: any = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        urlType: formData.urlType,
        localFile: formData.localFile,
        tags: [],
        // topic: formData.topic,
      };

      if (campaignId) {
        payload.competition = { id: parseInt(campaignId) };
      }

      if (user.id) {
        payload.creator = user;
        payload.createdBy = user.login;
        payload.createdOn = new Date().toISOString();
      }

      // Upload video post
      await dispatch(uploadVideoPost(payload)).unwrap();

      toast.success("Video post created successfully");
      navigate("/videos");
    } catch (error: any) {
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
        <Button onClick={handleBack} className={styles.backButton}>
          <img src={backIcon} alt="Back" />
        </Button>
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
            rows={4}
          />
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
            <option value="">Select Topic</option>
            {VIDEO_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <span className={styles.required}>*</span>
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
              onChange={handleChange}
              accept="video/*"
              className={styles.fileInput}
              required
            />
            <span className={styles.required}>*</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? "Creating..." : "Create Video Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateVideoPost;

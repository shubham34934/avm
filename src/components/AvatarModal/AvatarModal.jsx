import React, { useState, useRef } from "react";
import styles from "./AvatarModal.module.css";
import Button from "../Button/Button";
import defaultAvatar from "../../assets/images/default-avatar.png";

const AvatarModal = ({ isOpen, onClose, onSave, currentImageUrl }) => {
  const [selectedTab, setSelectedTab] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState(
    currentImageUrl || defaultAvatar
  );
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleUrlPreview = () => {
    if (imageUrl.trim()) {
      setPreviewImage(imageUrl);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSave = () => {
    if (selectedTab === "upload" && file) {
      onSave({ type: "file", file });
    } else if (selectedTab === "url" && imageUrl.trim()) {
      onSave({ type: "url", url: imageUrl });
    }
    onClose();
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  const isSaveDisabled =
    (selectedTab === "upload" && !file) ||
    (selectedTab === "url" && !imageUrl.trim());

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Update Avatar</h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              selectedTab === "upload" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("upload")}
          >
            Upload Image
          </button>
          <button
            className={`${styles.tab} ${
              selectedTab === "url" ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange("url")}
          >
            Image URL
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.previewContainer}>
            <img
              src={previewImage}
              alt="Avatar Preview"
              className={styles.previewImage}
              onError={(e) => {
                e.target.src = defaultAvatar;
                e.target.onerror = null;
              }}
            />
          </div>

          {selectedTab === "upload" && (
            <div className={styles.uploadSection}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <Button onClick={handleBrowseClick} variant="secondary">
                Browse Files
              </Button>
              <p className={styles.helperText}>
                {file
                  ? `Selected: ${file.name}`
                  : "Select an image file to upload"}
              </p>
            </div>
          )}

          {selectedTab === "url" && (
            <div className={styles.urlSection}>
              <div className={styles.inputGroup}>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  placeholder="Paste image URL here"
                  className={styles.urlInput}
                />
                <Button
                  onClick={handleUrlPreview}
                  variant="secondary"
                  size="small"
                >
                  Preview
                </Button>
              </div>
              <p className={styles.helperText}>
                Enter a direct URL to an image (JPG, PNG, etc.)
              </p>
            </div>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.buttonWrapper}>
            <Button
              onClick={onClose}
              variant="secondary"
              className={styles.actionButton}
            >
              Cancel
            </Button>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              onClick={handleSave}
              variant="primary"
              className={styles.actionButton}
            >
              Save Avatar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;

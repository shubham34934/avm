/**
 * Generates an array of tags based on video properties
 * @param {Object} video - The video object containing various properties
 * @returns {Array} Array of tag objects with text and variant properties
 */
export const generateVideoTags = (video) => {
  if (!video) return [];
  
  const tags = [];
  
  // Add status tag if available
  if (video.status) {
    tags.push({
      text: video.status,
      variant: video.status.toLowerCase()
    });
  }
  
  // Handle shortlisted status from Videos component
  if (video.isShortlisted === true) {
    tags.push({
      text: "Shortlisted",
      variant: "success"
    });
  }
  
  // Add AI Generated tag if applicable
  if (video.isAIGenerated === true) {
    tags.push({
      text: "AI Generated",
      variant: "accent"
    });
  }
  
  // Add Active/Inactive tag
  if (video.isActive === true) {
    tags.push({
      text: "Active",
      variant: "active"
    });
  } else if (video.isActive === false) {
    tags.push({
      text: "Inactive",
      variant: "inactive"
    });
  }
  
  // Add Blocked tag if applicable
  if (video.isBlocked === true) {
    tags.push({
      text: "Blocked",
      variant: "blocked"
    });
  }
  
  // Add Moderated tag if applicable
  if (video.isModerated === true) {
    tags.push({
      text: "Moderated",
      variant: "in progress"
    });
  }
  
  // Add Premium tag if applicable
  if (video.isPremium === true) {
    tags.push({
      text: "Premium",
      variant: "superAdmin"
    });
  }
  
  // If no tags were generated but we have a status, add a default tag
  if (tags.length === 0 && video.status) {
    tags.push({
      text: video.status,
      variant: video.status.toLowerCase()
    });
  }
  
  // If we still have no tags, add a default "Published" tag
  if (tags.length === 0) {
    tags.push({
      text: "Published",
      variant: "published"
    });
  }
  
  return tags;
};

/**
 * Extracts YouTube thumbnail URLs from a YouTube video URL
 * @param {string} videoUrl - The YouTube video URL (standard or Shorts)
 * @returns {Array|null} Array of thumbnail URLs in different qualities, or null if not a valid YouTube URL
 */
export const getYouTubeThumbnail = (videoUrl) => {
  try {
    // Regular expressions to match different YouTube URL formats (including Shorts)
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoUrl.match(youtubeRegex);

    if (match && match[1]) {
      const videoId = match[1];
      // Return different quality thumbnails in order of preference
      const thumbnailSizes = [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/default.jpg`,
      ];
      return thumbnailSizes;
    }
  } catch (error) {
    console.error("Error extracting YouTube thumbnail:", error);
  }
  return null;
};

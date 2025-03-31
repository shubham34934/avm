export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(dateString);
};

/**
 * Determines if a campaign is currently in progress based on its start and end dates
 * @param {string|Date} startDate - The campaign start date
 * @param {string|Date} endDate - The campaign end date
 * @returns {boolean} - True if the campaign is currently in progress, false otherwise
 */
export const isCampaignInProgress = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Set all dates to the beginning of the day for consistent comparison
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999); // End of the day for end date
  
  return today >= start && today <= end;
};

/**
 * Gets the campaign status based on its dates and status field
 * @param {string|Date} startDate - The campaign start date
 * @param {string|Date} endDate - The campaign end date
 * @param {string} status - The current status from the database
 * @returns {string} - 'upcoming', 'active', or 'ended'
 */
export const getCampaignTimeStatus = (startDate, endDate, status) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If the campaign is not active in the database, respect that status
  if (status !== 'ACTIVE' && status !== 'Active') {
    return 'inactive';
  }
  
  if (today < start) {
    return 'upcoming';
  } else if (today > end) {
    return 'ended';
  } else {
    return 'active';
  }
};

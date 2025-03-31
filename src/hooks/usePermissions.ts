import { useAppSelector } from "../config/store";
import { getUserRoleWithPriority, hasFeatureAccess } from "../reducers/permissions";
import { useUser } from "./useUser";
import { USER_ROLES } from "../utils/constants";

// Define a type for the user object based on the application's structure
interface UserWithAuthorities {
  authorities?: string[];
  [key: string]: any; // Allow other properties
}

/**
 * Custom hook for handling role-based permissions throughout the application
 * Provides easy access to check if a user has access to specific features
 */
export const usePermissions = () => {
  const { user } = useUser();
  const permissionsState = useAppSelector((state) => state.permissions);
  
  // Get the highest priority role for the current user
  // Cast user to UserWithAuthorities to ensure TypeScript recognizes the authorities property
  const userRole = getUserRoleWithPriority((user as UserWithAuthorities)?.authorities);
  
  // Function to check if the user has access to a specific feature
  const hasAccess = (feature: string): boolean => {
    return hasFeatureAccess(
      feature as any,
      userRole,
      permissionsState
    );
  };
  
  return {
    userRole,
    hasAccess,
    // Convenience methods for common feature checks
    canViewStats: hasAccess('stats'),
    canViewLiveCampaigns: hasAccess('liveCampaigns'),
    canViewVideosUploaded: hasAccess('videosUploaded'),
    canViewMostUpvoted: hasAccess('mostUpvoted'),
    canViewCategoryGrid: hasAccess('categoryGrid'),
    canViewVideoCarousel: hasAccess('videoCarousel'),
    canViewFeedVideos: hasAccess('feedVideos'),
  };
};

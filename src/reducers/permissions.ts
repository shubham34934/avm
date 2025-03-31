import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { USER_ROLES } from "../utils/constants";

interface PermissionsState {
  // Role-based permissions for different features
  featureAccess: {
    stats: string[];
    liveCampaigns: string[];
    videosUploaded: string[];
    mostUpvoted: string[];
    categoryGrid: string[];
    videoCarousel: string[];
    feedVideos: string[];
  };
}

// Define the initial state
const initialState: PermissionsState = {
  featureAccess: {
    stats: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
    liveCampaigns: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.CREATOR],
    videosUploaded: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.CREATOR],
    mostUpvoted: [USER_ROLES.USER, USER_ROLES.CREATOR],
    categoryGrid: [USER_ROLES.USER, USER_ROLES.CREATOR],
    videoCarousel: [USER_ROLES.USER, USER_ROLES.CREATOR],
    feedVideos: [USER_ROLES.USER, USER_ROLES.CREATOR],
  },
};

// Create the permissions slice
const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    // Add reducers if you need to dynamically update permissions
    updateFeatureAccess: (state, action: PayloadAction<{ feature: string; roles: string[] }>) => {
      const { feature, roles } = action.payload;
      if (feature in state.featureAccess) {
        (state.featureAccess as any)[feature] = roles;
      }
    },
  },
});

// Export actions
export const { updateFeatureAccess } = permissionsSlice.actions;

// Helper functions for role-based access control

/**
 * Determines the highest priority role from a user's authorities array
 * based on the hierarchy: Super Admin > Admin > Creator > User
 * @param authorities Array of user role authorities
 * @returns The highest priority role
 */
export const getUserRoleWithPriority = (authorities: string[] | undefined): string => {
  if (!authorities || authorities.length === 0) return USER_ROLES.USER;
  
  // Define role priority
  const rolePriority = [
    USER_ROLES.SUPER_ADMIN, // Highest priority
    USER_ROLES.ADMIN,
    USER_ROLES.CREATOR,
    USER_ROLES.USER // Lowest priority
  ];
  
  // Find the highest priority role that exists in the user's authorities
  for (const role of rolePriority) {
    if (authorities.includes(role)) {
      return role;
    }
  }
  
  // Default to the first authority if none match our priority list
  return authorities[0];
};

/**
 * Checks if a user has access to a specific feature based on their role
 * @param feature The feature to check access for
 * @param userRole The user's role
 * @param state The permissions state
 * @returns Boolean indicating if the user has access
 */
export const hasFeatureAccess = (
  feature: keyof PermissionsState['featureAccess'],
  userRole: string,
  state: PermissionsState
): boolean => {
  if (!state.featureAccess[feature]) return false;
  return state.featureAccess[feature].includes(userRole);
};

export default permissionsSlice.reducer;

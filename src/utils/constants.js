// Mapping of user role authorities to display text
export const USER_TYPE_DISPLAY = {
  ROLE_ADMIN: "Admin",
  ROLE_USER: "Creator",
  ROLE_SUPER_ADMIN: "Super Admin",
  ROLE_CREATOR: "End User",
};

export const USER_ROLES = {
  USER: "ROLE_USER",
  ADMIN: "ROLE_ADMIN",
  CREATOR: "ROLE_CREATOR",
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
};

/**
 * Get user type display text based on authorities
 * @param {string[]} authorities - Array of user authorities
 * @returns {string} Displayed user type text
 */
export const getUserTypeDisplay = (authorities) => {
  // Ensure authorities is an array
  const authArray = Array.isArray(authorities) ? authorities : [];

  // Find the first matching authority and return its display text
  const matchedAuthority = authArray.find(
    (authority) => USER_TYPE_DISPLAY[authority]
  );

  return matchedAuthority ? USER_TYPE_DISPLAY[matchedAuthority] : "User";
};

/**
 * Combine user authorities into a comma-separated string with display text
 * @param {string[]} authorities - Array of user authorities
 * @returns {string} Comma-separated authorities with display text
 */
export const combineAuthorities = (authorities = []) => {
  return authorities
    .map((authority) => USER_TYPE_DISPLAY[authority] || authority)
    .join(", ");
};

export const getUserTitle = (user = {}) => {
  let { firstName, lastName } = user;
  if (!firstName && !lastName) {
    return user.login;
  }
  return `${user.firstName} ${user.lastName}`;
};

export const checkAllowedRole = (allowedRole, userRole) => {
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  const roles = Array.isArray(userRole) ? userRole : [userRole];
  if (allowedRoles.length === 0 || roles.length === 0) return false;
  let result = roles.some((role) => allowedRoles.includes(role));
  return result;
};

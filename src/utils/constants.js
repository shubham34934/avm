// Mapping of user role authorities to display text
export const USER_TYPE_DISPLAY = {
  ROLE_ADMIN: "Super Admin",
  ROLE_USER: "Creator",
  ROLE_MANAGER: "Manager",
};

/**
 * Get user type display text based on authorities
 * @param {string[]} authorities - Array of user authorities
 * @returns {string} Displayed user type text
 */
export const getUserTypeDisplay = (authorities = []) => {
  // Find the first matching authority and return its display text
  const matchedAuthority = authorities.find(
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

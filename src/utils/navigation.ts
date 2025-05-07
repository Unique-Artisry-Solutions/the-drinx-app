
/**
 * Navigation utility functions for consistent route handling
 */

/**
 * Checks if a path is active based on the current location
 * @param currentPath The current location path
 * @param targetPath The path to check
 * @returns boolean indicating if the path is active
 */
export const isPathActive = (currentPath: string, targetPath: string): boolean => {
  // Exact match
  if (currentPath === targetPath) {
    return true;
  }
  
  // Special case for home page
  if (targetPath === '/' && currentPath !== '/') {
    return false;
  }
  
  // Check if the current path starts with the target path and is followed by / or nothing
  // This allows /profile and /profile/settings to both have /profile as active
  if (currentPath.startsWith(targetPath)) {
    // Get the character after the target path in the current path
    const nextChar = currentPath.charAt(targetPath.length);
    return nextChar === '' || nextChar === '/' || nextChar === '?';
  }
  
  return false;
};

/**
 * Gets the appropriate profile path based on user type
 * @param userType The type of user
 * @returns The appropriate profile path
 */
export const getProfilePathByUserType = (userType: string): string => {
  switch (userType) {
    case 'establishment':
      return '/establishment/profile';
    case 'promoter':
      return '/promoter/profile';
    case 'admin':
      return '/admin/profile';
    default:
      return '/profile';
  }
};

/**
 * Gets the appropriate home path based on user type
 * @param userType The type of user
 * @returns The appropriate home path
 */
export const getHomePathByUserType = (userType: string): string => {
  switch (userType) {
    case 'establishment':
      return '/establishment/dashboard';
    case 'promoter':
      return '/promoter/dashboard';
    case 'admin':
      return '/admin/dashboard';
    case 'individual':
      return '/explore';
    default:
      return '/landing';
  }
};

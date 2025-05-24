
/**
 * Utility for clearing session-related localStorage items
 */

/**
 * Clear all authentication-related localStorage items
 */
export const clearAllSessions = (): void => {
  const authKeys = [
    'user_authenticated',
    'user_email',
    'user_type',
    'user_username',
    'spiritless-auth-storage',
    'sb-dvifibvzwunnpcsihpxq-auth-token'
  ];
  
  authKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage key: ${key}`, error);
    }
  });
  
  console.log('All session data cleared from localStorage');
};

/**
 * Clear specific session data by key
 */
export const clearSessionData = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove localStorage key: ${key}`, error);
  }
};

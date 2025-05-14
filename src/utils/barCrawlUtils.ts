
/**
 * Check if a string is a valid UUID
 */
export const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Check if this is a sample bar crawl ID (for demo data)
 */
export const isSampleBarCrawlId = (id: string): boolean => {
  return /^bc-\d+$/.test(id);
};

/**
 * Format error message for bar crawl operations
 */
export const formatBarCrawlErrorMessage = (error: any): string => {
  // Parse database constraint error
  if (error.message?.includes('unique constraint')) {
    return "You've already joined this circuit";
  }
  
  // Parse authentication error
  if (error.message?.includes('sign in')) {
    return "Please sign in to join";
  }
  
  // Parse invalid UUID error
  if (error.message?.includes('Invalid')) {
    return "Invalid bar crawl ID format";
  }
  
  // Generic error message
  return error.message || 'An error occurred';
};

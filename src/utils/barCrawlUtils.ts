
/**
 * Checks if a bar crawl ID is a sample ID (starts with 'bc-')
 * 
 * @param barCrawlId - The ID to check
 * @returns True if the ID is a sample bar crawl ID
 */
export const isSampleBarCrawlId = (barCrawlId: string): boolean => {
  return typeof barCrawlId === 'string' && barCrawlId.startsWith('bc-');
};

/**
 * Validates a UUID format
 * 
 * @param uuid - The UUID string to validate
 * @returns True if the string is a valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Formats error messages for bar crawl operations into user-friendly messages
 * 
 * @param error - The error object
 * @returns A user-friendly error message
 */
export const formatBarCrawlErrorMessage = (error: any): string => {
  let errorMessage = 'Failed to complete operation. Please try again.';
  
  if (error?.message?.includes('violates row level security policy')) {
    errorMessage = 'You do not have permission to perform this action.';
  } else if (error?.message?.includes('violates foreign key constraint')) {
    errorMessage = 'This Swig Circuit does not exist.';
  } else if (error?.message?.includes('violates unique constraint')) {
    errorMessage = 'You are already participating in this Swig Circuit.';
  } else if (error?.message?.includes('invalid input syntax') || error?.message?.includes('Invalid bar crawl ID format')) {
    errorMessage = 'Invalid Swig Circuit ID format. Please contact support.';
  }
  
  return errorMessage;
};

/**
 * Checks if a bar crawl ID is a numeric ID
 * Used for determining if an ID needs special handling
 * 
 * @param barCrawlId - The ID to check
 * @returns True if the ID is numeric
 */
export const isNumericId = (barCrawlId: string): boolean => {
  return /^\d+$/.test(barCrawlId);
};

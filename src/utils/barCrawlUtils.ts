
/**
 * Checks if a bar crawl ID is a sample ID (starts with 'bc-')
 */
export const isSampleBarCrawlId = (barCrawlId: string): boolean => {
  return typeof barCrawlId === 'string' && barCrawlId.startsWith('bc-');
};

/**
 * Validates a UUID format
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Formats error messages for bar crawl operations
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


/**
 * Key for storing session validation timestamp in localStorage
 */
export const SESSION_VALIDATION_KEY = 'session_last_validated';

/**
 * Maximum age of session validation before requiring revalidation (5 minutes)
 */
export const MAX_SESSION_AGE_MS = 5 * 60 * 1000;

/**
 * Default timeout before showing stuck state detection (8 seconds)
 */
export const DEFAULT_STUCK_TIMEOUT_MS = 8 * 1000;

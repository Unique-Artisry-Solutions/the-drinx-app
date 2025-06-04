
// Constants utility file
export const APP_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEBOUNCE_DELAY: 300,
  RETRY_ATTEMPTS: 3,
  TIMEOUT_DURATION: 5000
} as const;

export const API_ENDPOINTS = {
  USERS: '/api/users',
  ESTABLISHMENTS: '/api/establishments',
  EVENTS: '/api/events',
  ANALYTICS: '/api/analytics'
} as const;

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 50,
  MAX_BIO_LENGTH: 500
} as const;

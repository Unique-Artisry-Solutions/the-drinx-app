/**
 * Feature Flags Configuration
 * 
 * Controls experimental and development-only features.
 * Environment variables are injected via Vite (VITE_ prefix required).
 */

/**
 * Returns whether the promoter route bypass is allowed.
 * 
 * This flag enables unauthenticated access to promoter routes in development.
 * It exists for local development workflow where developers need to test
 * promoter features without authentication context.
 * 
 * Security notes:
 * - Default: false (secure, requires authentication)
 * - Only enabled in .env.local or non-production environments
 * - Cannot be enabled in production builds
 * - Should NEVER be enabled in staging or production
 * 
 * @returns {boolean} True if promoter route bypass is allowed, false otherwise
 */
export const isPromoterRouteBypassAllowed = (): boolean => {
  // Only allow in development with explicit flag
  const flagEnabled = import.meta.env.VITE_ALLOW_ROUTE_BYPASS === 'true';
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  // Never allow in production, regardless of flag
  if (isProduction) {
    return false;
  }
  
  // Only allow in development when flag is explicitly enabled
  return isDevelopment && flagEnabled;
};

/**
 * Check if we're in a production-like environment
 * where authentication is strictly required
 */
export const isProductionEnvironment = (): boolean => {
  return import.meta.env.PROD;
};

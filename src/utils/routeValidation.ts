
import { UserType } from '@/types/navigation';

export interface RouteValidationResult {
  isValid: boolean;
  error?: string;
  suggestedRedirect?: string;
}

export interface RouteValidationContext {
  userType: UserType | null;
  isAuthenticated: boolean;
  isDevelopment: boolean;
  isDevModeActive: boolean;
}

/**
 * Validates route access based on user context and development mode
 */
export const validateRouteAccess = (
  path: string, 
  context: RouteValidationContext
): RouteValidationResult => {
  const { userType, isAuthenticated, isDevelopment, isDevModeActive } = context;
  
  // Development mode bypass
  if (isDevelopment && isDevModeActive) {
    console.log('RouteValidation: Development mode bypass active for path:', path);
    return { isValid: true };
  }
  
  // Define route patterns and their requirements
  const routePatterns = [
    {
      pattern: /^\/admin/,
      requiredAuth: true,
      allowedUserTypes: ['admin'],
      fallback: '/login'
    },
    {
      pattern: /^\/establishment/,
      requiredAuth: true,
      allowedUserTypes: ['establishment'],
      fallback: '/explore'
    },
    {
      pattern: /^\/promoter/,
      requiredAuth: true,
      allowedUserTypes: ['promoter'],
      fallback: '/explore'
    },
    {
      pattern: /^\/profile/,
      requiredAuth: true,
      allowedUserTypes: ['individual', 'establishment', 'promoter', 'admin'],
      fallback: '/login'
    },
    {
      pattern: /^\/notifications/,
      requiredAuth: true,
      allowedUserTypes: ['individual', 'establishment', 'promoter', 'admin'],
      fallback: '/login'
    }
  ];
  
  // Find matching pattern
  const matchedPattern = routePatterns.find(pattern => pattern.pattern.test(path));
  
  if (!matchedPattern) {
    // Public route or unmatched route
    return { isValid: true };
  }
  
  // Check authentication requirement
  if (matchedPattern.requiredAuth && !isAuthenticated) {
    return {
      isValid: false,
      error: 'Authentication required',
      suggestedRedirect: matchedPattern.fallback
    };
  }
  
  // Check user type restrictions
  if (isAuthenticated && matchedPattern.allowedUserTypes.length > 0) {
    const currentUserType = userType || 'individual';
    if (!matchedPattern.allowedUserTypes.includes(currentUserType)) {
      return {
        isValid: false,
        error: `Access denied. Required user type: ${matchedPattern.allowedUserTypes.join(' or ')}`,
        suggestedRedirect: getUserTypeFallback(currentUserType)
      };
    }
  }
  
  return { isValid: true };
};

/**
 * Get appropriate fallback route for user type
 */
const getUserTypeFallback = (userType: UserType): string => {
  switch (userType) {
    case 'admin':
      return '/admin/system-breakdown';
    case 'establishment':
      return '/establishment/dashboard';
    case 'promoter':
      return '/promoter/dashboard';
    case 'individual':
    default:
      return '/explore';
  }
};

/**
 * Enhanced route debugging for development mode
 */
export const debugRoute = (path: string, context: RouteValidationContext): void => {
  if (!context.isDevelopment) return;
  
  console.group(`🔍 Route Debug: ${path}`);
  console.log('Context:', context);
  
  const validation = validateRouteAccess(path, context);
  console.log('Validation Result:', validation);
  
  if (!validation.isValid) {
    console.warn('❌ Route Access Denied:', validation.error);
    console.log('🔄 Suggested Redirect:', validation.suggestedRedirect);
  } else {
    console.log('✅ Route Access Granted');
  }
  
  console.groupEnd();
};

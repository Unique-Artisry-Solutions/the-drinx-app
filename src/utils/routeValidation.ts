
import { UserType } from '@/types/navigation';

export interface RouteValidationResult {
  isValid: boolean;
  error?: string;
  suggestedRedirect?: string;
  fallbackComponent?: string;
}

export interface RouteValidationContext {
  userType: UserType | null;
  isAuthenticated: boolean;
  isDevelopment: boolean;
  isDevModeActive: boolean;
}

/**
 * Enhanced route validation with better error handling and fallbacks
 */
export const validateRouteAccess = (
  path: string, 
  context: RouteValidationContext
): RouteValidationResult => {
  const { userType, isAuthenticated, isDevelopment, isDevModeActive } = context;
  
  // Development mode bypass with logging
  if (isDevelopment && isDevModeActive) {
    console.log('RouteValidation: Development mode bypass active for path:', path);
    return { isValid: true };
  }
  
  // Handle edge case: empty or invalid paths
  if (!path || path === '') {
    return {
      isValid: false,
      error: 'Invalid route path',
      suggestedRedirect: '/landing'
    };
  }
  
  // Handle root path redirect
  if (path === '/') {
    if (isAuthenticated && userType) {
      return {
        isValid: false,
        suggestedRedirect: getUserTypeFallback(userType)
      };
    }
    return {
      isValid: false,
      suggestedRedirect: '/landing'
    };
  }
  
  // Define comprehensive route patterns
  const routePatterns = [
    {
      pattern: /^\/admin/,
      requiredAuth: true,
      allowedUserTypes: ['admin'],
      fallback: '/login',
      description: 'Admin area'
    },
    {
      pattern: /^\/establishment/,
      requiredAuth: true,
      allowedUserTypes: ['establishment'],
      fallback: '/explore',
      description: 'Establishment dashboard'
    },
    {
      pattern: /^\/promoter/,
      requiredAuth: true,
      allowedUserTypes: ['promoter'],
      fallback: '/explore',
      description: 'Promoter dashboard'
    },
    {
      pattern: /^\/profile/,
      requiredAuth: true,
      allowedUserTypes: ['individual', 'establishment', 'promoter', 'admin'],
      fallback: '/login',
      description: 'User profile'
    },
    {
      pattern: /^\/notifications/,
      requiredAuth: true,
      allowedUserTypes: ['individual', 'establishment', 'promoter', 'admin'],
      fallback: '/login',
      description: 'Notifications'
    },
    // Public routes with explicit patterns
    {
      pattern: /^\/landing$/,
      requiredAuth: false,
      allowedUserTypes: [],
      fallback: null,
      description: 'Landing page'
    },
    {
      pattern: /^\/explore$/,
      requiredAuth: false,
      allowedUserTypes: [],
      fallback: null,
      description: 'Explore page'
    },
    {
      pattern: /^\/login$/,
      requiredAuth: false,
      allowedUserTypes: [],
      fallback: null,
      description: 'Login page'
    },
    {
      pattern: /^\/register$/,
      requiredAuth: false,
      allowedUserTypes: [],
      fallback: null,
      description: 'Registration page'
    },
    {
      pattern: /^\/404$/,
      requiredAuth: false,
      allowedUserTypes: [],
      fallback: null,
      description: 'Not found page'
    }
  ];
  
  // Find matching pattern
  const matchedPattern = routePatterns.find(pattern => pattern.pattern.test(path));
  
  // Handle unmatched routes (potential 404)
  if (!matchedPattern) {
    console.warn('RouteValidation: Unmatched route pattern for:', path);
    return {
      isValid: false,
      error: 'Route not found',
      suggestedRedirect: '/404',
      fallbackComponent: 'NotFound'
    };
  }
  
  // Check authentication requirement
  if (matchedPattern.requiredAuth && !isAuthenticated) {
    return {
      isValid: false,
      error: `Authentication required for ${matchedPattern.description}`,
      suggestedRedirect: matchedPattern.fallback || '/login'
    };
  }
  
  // Check user type restrictions
  if (isAuthenticated && matchedPattern.allowedUserTypes.length > 0) {
    const currentUserType = userType || 'individual';
    if (!matchedPattern.allowedUserTypes.includes(currentUserType)) {
      return {
        isValid: false,
        error: `Access denied to ${matchedPattern.description}. Required user type: ${matchedPattern.allowedUserTypes.join(' or ')}`,
        suggestedRedirect: getUserTypeFallback(currentUserType)
      };
    }
  }
  
  // Special handling for authenticated users on public auth pages
  if (isAuthenticated && (path === '/login' || path === '/register')) {
    return {
      isValid: false,
      error: 'Already authenticated',
      suggestedRedirect: getUserTypeFallback(userType || 'individual')
    };
  }
  
  return { isValid: true };
};

/**
 * Get appropriate fallback route for user type with better defaults
 */
const getUserTypeFallback = (userType: UserType): string => {
  const fallbackMap: Record<UserType, string> = {
    admin: '/admin/system-breakdown',
    establishment: '/establishment/dashboard',
    promoter: '/promoter/dashboard',
    individual: '/explore'
  };
  
  return fallbackMap[userType] || '/explore';
};

/**
 * Enhanced route debugging with comprehensive information
 */
export const debugRoute = (path: string, context: RouteValidationContext): void => {
  if (!context.isDevelopment) return;
  
  console.group(`🔍 Enhanced Route Debug: ${path}`);
  console.log('📍 Path Analysis:', {
    originalPath: path,
    normalizedPath: path.toLowerCase(),
    pathSegments: path.split('/').filter(Boolean),
    queryParams: new URLSearchParams(window.location.search).toString()
  });
  
  console.log('👤 User Context:', {
    userType: context.userType,
    isAuthenticated: context.isAuthenticated,
    isDevelopment: context.isDevelopment,
    isDevModeActive: context.isDevModeActive
  });
  
  const validation = validateRouteAccess(path, context);
  console.log('🛡️ Validation Result:', validation);
  
  // Route pattern matching analysis
  const adminPattern = /^\/admin/;
  const establishmentPattern = /^\/establishment/;
  const promoterPattern = /^\/promoter/;
  const profilePattern = /^\/profile/;
  
  console.log('🎯 Pattern Matching:', {
    isAdminRoute: adminPattern.test(path),
    isEstablishmentRoute: establishmentPattern.test(path),
    isPromoterRoute: promoterPattern.test(path),
    isProfileRoute: profilePattern.test(path),
    isPublicRoute: !adminPattern.test(path) && !establishmentPattern.test(path) && !promoterPattern.test(path) && !profilePattern.test(path)
  });
  
  if (!validation.isValid) {
    console.warn('❌ Route Access Denied:', validation.error);
    console.log('🔄 Suggested Actions:', {
      redirect: validation.suggestedRedirect,
      fallbackComponent: validation.fallbackComponent,
      recommendedUserType: context.userType ? getUserTypeFallback(context.userType) : 'No user type'
    });
  } else {
    console.log('✅ Route Access Granted');
  }
  
  console.groupEnd();
};

/**
 * Validate route parameters for dynamic routes
 */
export const validateRouteParams = (
  params: Record<string, string | undefined>,
  rules: Record<string, (value: string) => boolean>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  Object.entries(rules).forEach(([paramName, validator]) => {
    const value = params[paramName];
    if (value !== undefined && !validator(value)) {
      errors.push(`Invalid parameter: ${paramName} (${value})`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Test route accessibility for all user types
 */
export const testRouteAccessibility = (path: string): Record<UserType | 'anonymous', RouteValidationResult> => {
  const userTypes: (UserType | 'anonymous')[] = ['anonymous', 'individual', 'establishment', 'promoter', 'admin'];
  const results: Record<UserType | 'anonymous', RouteValidationResult> = {} as any;
  
  userTypes.forEach(type => {
    const context: RouteValidationContext = {
      userType: type === 'anonymous' ? null : type as UserType,
      isAuthenticated: type !== 'anonymous',
      isDevelopment: false,
      isDevModeActive: false
    };
    
    results[type] = validateRouteAccess(path, context);
  });
  
  return results;
};

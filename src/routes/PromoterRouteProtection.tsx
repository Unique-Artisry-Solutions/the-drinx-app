import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { isPromoterRouteBypassAllowed } from '@/config/featureFlags';

interface PromoterRouteProtectionProps {
  children: React.ReactNode;
}

/**
 * PromoterRouteProtection Component
 * 
 * Wraps promoter routes with authentication and feature flag checks.
 * 
 * Behavior:
 * - If feature flag (VITE_ALLOW_ROUTE_BYPASS) is enabled AND in dev mode:
 *   Routes are accessible without authentication (dev workflow bypass)
 * - Otherwise (default, production-safe):
 *   Routes require 'promoter' user type authentication
 * 
 * This ensures:
 * ✓ Developers can test promoter features locally without auth context
 * ✓ Production always requires authentication
 * ✓ Bypass cannot be accidentally enabled in production
 */
const PromoterRouteProtection: React.FC<PromoterRouteProtectionProps> = ({ children }) => {
  const { userType, isLoading, authStable, isAuthenticated } = useAuthenticatedUser();
  const location = useLocation();
  const bypassEnabled = isPromoterRouteBypassAllowed();

  // Wait for loading to finish
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Wait for auth to stabilize
  if (!authStable) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If bypass is enabled in dev, allow all access
  if (bypassEnabled) {
    console.log('🚀 Promoter route bypass enabled (dev mode):', location.pathname);
    return <>{children}</>;
  }

  // Default: require promoter authentication
  if (!isAuthenticated || userType !== 'promoter') {
    // Store the current location for potential redirect after login
    try {
      localStorage.setItem('auth_redirect', location.pathname);
    } catch (error) {
      console.warn('Failed to store redirect path:', error);
    }
    
    console.log('🔒 Promoter route access denied:', {
      path: location.pathname,
      isAuthenticated,
      userType,
      required: 'promoter'
    });
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PromoterRouteProtection;

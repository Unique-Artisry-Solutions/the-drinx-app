
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { isRedirectLoop } from '@/utils/redirectUtils';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  
  // Generate a unique route ID for tracking
  const routeId = React.useId();
  
  // Debug logging for route protection
  useEffect(() => {
    // Check URL params for debugging
    const urlParams = new URLSearchParams(window.location.search);
    const debugAuth = urlParams.get('debug_auth') === 'true';
    
    if (debugAuth) {
      console.log(`[PROTECTED ROUTE ${routeId}] Auth check`, { 
        path: location.pathname, 
        isLoading, 
        hasUser: !!user, 
        isEmailVerified,
        isAdminBypass,
        userType: localStorage.getItem('user_type')
      });
    } else {
      console.log(`[PROTECTED ROUTE ${routeId}] Path: ${location.pathname}, hasUser: ${!!user}, isLoading: ${isLoading}`);
    }
  }, [isLoading, user, isEmailVerified, isAdminBypass, location.pathname, routeId]);
  
  if (isLoading) {
    console.log(`[PROTECTED ROUTE ${routeId}] Still loading auth state`);
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    console.log(`[PROTECTED ROUTE ${routeId}] Admin bypass enabled, allowing access`);
    // Admin bypass is enabled, allow access
    return <>{children}</>;
  }
  
  // Check for redirect loops before redirecting
  if (isRedirectLoop()) {
    console.log(`[PROTECTED ROUTE ${routeId}] Detected potential redirect loop, showing error`);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full text-center">
          <h2 className="text-red-600 text-lg font-medium mb-2">Authentication Error</h2>
          <p className="text-gray-700 mb-4">
            A redirect loop was detected. Please try clearing your browser storage and refreshing the page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log(`[PROTECTED ROUTE ${routeId}] No authenticated user, redirecting to login`);
    // Store the path the user was trying to access
    localStorage.setItem('auth_redirect', location.pathname + location.search);
    // Non-logged in users should be redirected to the login page
    return <Navigate to="/login" />;
  }
  
  if (!isEmailVerified) {
    console.log(`[PROTECTED ROUTE ${routeId}] Email not verified, redirecting to verification page`);
    return <Navigate to="/verify-email" />;
  }
  
  // Check if user is trying to access Create Swig Circuit page but is not a promoter
  const isCreatingSwigCircuit = window.location.pathname === '/create-bar-crawl' || 
                               window.location.pathname === '/create-swig-circuit';
  
  if (isCreatingSwigCircuit) {
    const userType = localStorage.getItem('user_type');
    console.log(`[PROTECTED ROUTE ${routeId}] Checking swig circuit access, user type:`, userType);
    
    if (userType !== 'promoter') {
      console.log(`[PROTECTED ROUTE ${routeId}] Non-promoter attempting to access swig circuit creation, redirecting`);
      // Redirect non-promoters away from circuit creation
      return <Navigate to="/explore" />;
    }
  }
  
  console.log(`[PROTECTED ROUTE ${routeId}] Access granted`);
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  const userType = localStorage.getItem('user_type');
  const routeId = React.useId();
  
  useEffect(() => {
    console.log(`[ADMIN ROUTE ${routeId}] Auth state:`, { 
      isAdminAuthenticated, 
      isAdminBypass,
      userType 
    });
  }, [isAdminAuthenticated, isAdminBypass, userType, routeId]);
  
  // Check for redirect loops
  if (isRedirectLoop()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center">
          <h2 className="text-red-600 font-medium">Authentication Error</h2>
          <p className="text-gray-700">Redirect loop detected. Please clear your browser storage.</p>
          <button
            onClick={() => window.location.href = '/admin'}
            className="mt-2 bg-red-600 text-white px-3 py-1 text-sm rounded"
          >
            Return to Admin Login
          </button>
        </div>
      </div>
    );
  }
  
  // Allow access if admin authenticated or admin bypass with userType=admin
  if (isAdminAuthenticated || (isAdminBypass && userType === 'admin')) {
    console.log(`[ADMIN ROUTE ${routeId}] Admin authentication verified, allowing access`);
    return <>{children}</>;
  }
  
  console.log(`[ADMIN ROUTE ${routeId}] Not authenticated as admin, redirecting`);
  return <Navigate to="/admin" replace />;
};

export const TypedProtectedRoute = ({ 
  userType, 
  children 
}: { 
  userType: 'individual' | 'establishment' | 'promoter', 
  children: React.ReactNode 
}) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  const location = useLocation();
  const storedUserType = localStorage.getItem('user_type');
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  const routeId = React.useId();
  
  // Debug logging
  useEffect(() => {
    console.log(`[TYPED ROUTE ${routeId}] Auth check`, { 
      path: location.pathname,
      isLoading, 
      hasUser: !!user, 
      isEmailVerified,
      isAdminBypass,
      storedUserType,
      requiredType: userType,
      typesMatch: storedUserType === userType
    });
  }, [isLoading, user, isEmailVerified, isAdminBypass, storedUserType, userType, location, routeId]);
  
  // Check for redirect loops
  if (isRedirectLoop()) {
    console.log(`[TYPED ROUTE ${routeId}] Detected redirect loop, showing error message`);
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center">
          <h2 className="text-red-600 font-medium">Navigation Error</h2>
          <p className="text-gray-700">
            A redirect loop was detected. This may happen if you're trying to access content with the wrong account type.
          </p>
          <div className="mt-3 flex justify-center space-x-3">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              Home
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    console.log(`[TYPED ROUTE ${routeId}] Still loading auth state`);
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdminBypass) {
    console.log(`[TYPED ROUTE ${routeId}] Admin bypass active`);
    // For admin bypass, check if the stored type matches the required type
    if (storedUserType !== userType) {
      console.log(`[TYPED ROUTE ${routeId}] Admin bypass type mismatch, redirecting`);
      // Store the intended destination
      localStorage.setItem('auth_redirect', location.pathname + location.search);
      // Redirect if user types don't match
      return <Navigate to="/login" state={{ userType, message: `You need a ${userType} account to access this page` }} />;
    }
    
    console.log(`[TYPED ROUTE ${routeId}] Admin bypass type matches, allowing access`);
    return <>{children}</>;
  }
  
  if (!user) {
    console.log(`[TYPED ROUTE ${routeId}] No authenticated user, redirecting to login`);
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname + location.search);
    return <Navigate to="/login" state={{ userType }} />;
  }
  
  if (!isEmailVerified) {
    console.log(`[TYPED ROUTE ${routeId}] Email not verified, redirecting to verification page`);
    return <Navigate to="/verify-email" />;
  }
  
  if (storedUserType !== userType) {
    console.log(`[TYPED ROUTE ${routeId}] User type mismatch, redirecting`);
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname + location.search);
    return <Navigate to="/login" state={{ userType, message: `You need a ${userType} account to access this page` }} />;
  }
  
  console.log(`[TYPED ROUTE ${routeId}] Access granted`);
  return <>{children}</>;
};

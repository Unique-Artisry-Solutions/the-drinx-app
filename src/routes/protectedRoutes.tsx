
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

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
        userType: localStorage.getItem('user_type'),
        sessionStorage: {
          loginSuccess: sessionStorage.getItem('login_success'),
          loginUserType: sessionStorage.getItem('login_user_type'),
          loginAttemptId: sessionStorage.getItem('login_attempt_id'),
        }
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
    
    // Check URL params for debugging
    const urlParams = new URLSearchParams(window.location.search);
    const loginTs = urlParams.get('login_ts');
    const loginId = urlParams.get('login_id');
    
    if (loginTs && loginId) {
      console.log(`[TYPED ROUTE ${routeId}] Detected login redirect params: ID=${loginId}, TS=${loginTs}`);
      
      // For promoters specifically, do additional checks
      if (userType === 'promoter' && storedUserType === 'promoter') {
        console.log(`[TYPED ROUTE ${routeId}] Promoter route confirmed with matching user type`);
      }
    }
  }, [isLoading, user, isEmailVerified, isAdminBypass, storedUserType, userType, location, routeId]);
  
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


import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { checkAdminBypassStatus } from '@/utils/adminBypass';
import { getSessionDebug } from '@/lib/supabase';

// Component to show while verifying authentication
const AuthVerifyingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <p className="text-lg mb-2">Verifying authentication...</p>
      <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  </div>
);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, session, authStable } = useAuth();
  const location = useLocation();
  const { isEnabled: isAdminBypass } = checkAdminBypassStatus();
  
  // Add explicit debug logging
  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { 
      isLoading, 
      hasUser: !!user,
      hasSession: !!session,
      isAdminBypass,
      path: location.pathname,
      authStable,
      localStorage: {
        userAuthenticated: localStorage.getItem('user_authenticated'),
        userType: localStorage.getItem('user_type')
      }
    });
    
    // Perform a session debug check to display current state
    getSessionDebug();
  }, [isLoading, user, session, isAdminBypass, location.pathname, authStable]);
  
  // Show loading state until initial load is complete
  if (isLoading) {
    console.log("ProtectedRoute - Still loading auth state");
    return <AuthVerifyingScreen />;
  }
  
  // Show loading screen until auth is stable to prevent flickering
  if (!authStable) {
    console.log("ProtectedRoute - Waiting for stable auth state");
    return <AuthVerifyingScreen />;
  }
  
  // Check for admin bypass - immediate access with no redirect
  if (isAdminBypass) {
    console.log("ProtectedRoute - Admin bypass enabled, allowing access");
    return <>{children}</>;
  }
  
  // Check for authenticated session
  if (!user || !session) {
    console.log("ProtectedRoute - No authenticated user/session, redirecting to login");
    
    // Store the path the user was trying to access for after login
    localStorage.setItem('auth_redirect', location.pathname);
    
    // Redirect to login with state to allow return
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Additional check for required user types for specific pages
  const isCreatingSwigCircuit = location.pathname === '/create-bar-crawl' || 
                               location.pathname === '/create-swig-circuit';
  
  if (isCreatingSwigCircuit) {
    const userType = localStorage.getItem('user_type');
    console.log("ProtectedRoute - Checking swig circuit access, user type:", userType);
    
    if (userType !== 'promoter') {
      console.log("ProtectedRoute - Non-promoter attempting to access swig circuit creation, redirecting");
      return <Navigate to="/explore" replace />;
    }
  }
  
  console.log("ProtectedRoute - Access granted");
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, isLoading, session, authStable } = useAuth();
  const { isEnabled: isAdminBypass, userType } = checkAdminBypassStatus();
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  
  useEffect(() => {
    console.log("AdminRoute - Auth state:", { 
      isAdminAuthenticated, 
      isAdminBypass,
      userType,
      path: location.pathname,
      isLoading,
      hasUser: !!user,
      hasSession: !!session,
      authStable
    });
    
    // Debug session state
    getSessionDebug();
  }, [isAdminAuthenticated, isAdminBypass, userType, location.pathname, isLoading, user, session, authStable]);
  
  if (isLoading || !authStable) {
    return <AuthVerifyingScreen />;
  }
  
  // Allow access if admin authenticated or admin bypass with userType=admin
  if (isAdminAuthenticated || (isAdminBypass && userType === 'admin')) {
    console.log("AdminRoute - Admin authentication verified, allowing access");
    return <>{children}</>;
  }
  
  console.log("AdminRoute - Not authenticated as admin, redirecting");
  // Store the intended destination for after login
  localStorage.setItem('auth_redirect', location.pathname);
  return <Navigate to="/admin" replace />;
};

export const TypedProtectedRoute = ({ 
  userType, 
  children 
}: { 
  userType: 'individual' | 'establishment' | 'promoter', 
  children: React.ReactNode 
}) => {
  const { user, isLoading, session, authStable } = useAuth();
  const location = useLocation();
  const { isEnabled: isAdminBypass } = checkAdminBypassStatus();
  const storedUserType = localStorage.getItem('user_type');
  
  // Add explicit debug logging
  useEffect(() => {
    console.log("TypedProtectedRoute - Auth state:", { 
      isLoading, 
      hasUser: !!user,
      hasSession: !!session,
      isAdminBypass,
      storedUserType,
      requiredType: userType,
      path: location.pathname,
      typesMatch: storedUserType === userType,
      authStable
    });
    
    // Debug session
    getSessionDebug();
  }, [isLoading, user, session, isAdminBypass, storedUserType, userType, location.pathname, authStable]);
  
  if (isLoading || !authStable) {
    console.log("TypedProtectedRoute - Still loading auth state or waiting for stability");
    return <AuthVerifyingScreen />;
  }
  
  if (isAdminBypass) {
    console.log("TypedProtectedRoute - Admin bypass active");
    // For admin bypass, check if the stored type matches the required type
    if (storedUserType !== userType) {
      console.log("TypedProtectedRoute - Admin bypass type mismatch, redirecting");
      // Store the intended destination
      localStorage.setItem('auth_redirect', location.pathname);
      // Redirect if user types don't match
      return <Navigate to="/landing" state={{ message: `You need a ${userType} account to access this page` }} replace />;
    }
    
    console.log("TypedProtectedRoute - Admin bypass type matches, allowing access");
    return <>{children}</>;
  }
  
  // Check both the session and localStorage to be extra careful
  if (!user || !session) {
    console.log("TypedProtectedRoute - No authenticated user/session, redirecting to login");
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to="/login" state={{ userType }} replace />;
  }
  
  if (storedUserType !== userType) {
    console.log("TypedProtectedRoute - User type mismatch, redirecting");
    // Store the intended destination
    localStorage.setItem('auth_redirect', location.pathname);
    return <Navigate to="/landing" state={{ message: `You need a ${userType} account to access this page` }} replace />;
  }
  
  console.log("TypedProtectedRoute - Access granted");
  return <>{children}</>;
};

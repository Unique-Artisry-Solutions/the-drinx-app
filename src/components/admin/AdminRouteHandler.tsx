
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import AdminLogin from '@/pages/admin/AdminLogin';

const AdminRouteHandler: React.FC = () => {
  const { isDevelopment, isDevModeActive, devMode, isInitialized, isStateStable } = useDevelopmentMode();
  
  const debugInfo = {
    isDevelopment,
    isDevModeActive,
    devMode,
    isInitialized,
    isStateStable,
    shouldBypass: isDevelopment && isDevModeActive && devMode === 'admin' && isStateStable
  };
  
  console.log('AdminRouteHandler - Route handling logic:', debugInfo);
  
  useEffect(() => {
    console.log('AdminRouteHandler mounted at /admin route with state:', debugInfo);
  }, []);
  
  // Wait for development mode to initialize and stabilize
  if (!isInitialized || !isStateStable) {
    console.log('AdminRouteHandler: Waiting for dev mode initialization and stabilization');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing admin access...</p>
        </div>
      </div>
    );
  }
  
  // DEVELOPMENT MODE BYPASS: If dev mode is active with admin role, redirect ONLY ONCE
  if (isDevelopment && isDevModeActive && devMode === 'admin') {
    console.log('AdminRouteHandler: Development mode bypass active - redirecting to admin dashboard');
    // Use replace to prevent back button issues
    return <Navigate to="/admin/system-breakdown" replace />;
  }
  
  // NORMAL FLOW: Show login page
  console.log('AdminRouteHandler: Normal flow - showing admin login');
  return <AdminLogin />;
};

export default AdminRouteHandler;

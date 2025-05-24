
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import AdminSidebar from './AdminSidebar';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isDevModeActive, devMode, isDevelopment, isInitialized, isStateStable } = useDevelopmentMode();
  const { user, session, isLoading, authStable, userType } = useAuth();
  
  const debugInfo = {
    children: !!children,
    isDevModeActive,
    devMode,
    isDevelopment,
    isInitialized,
    isStateStable,
    user: !!user,
    session: !!session,
    userType,
    isLoading,
    authStable
  };
  
  // Log to confirm layout is rendering
  React.useEffect(() => {
    console.log('AdminLayout rendering with state:', debugInfo);
  }, [children, isDevModeActive, devMode, isDevelopment, isInitialized, isStateStable, user, session, userType, isLoading, authStable]);

  // Wait for development mode to initialize and stabilize
  if (!isInitialized || !isStateStable) {
    console.log('AdminLayout: Waiting for development mode initialization and stabilization');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  // EARLY RETURN: In development mode with admin role, bypass all auth checks
  if (isDevelopment && isDevModeActive && devMode === 'admin') {
    console.log('AdminLayout: Development mode active with admin role - BYPASSING ALL AUTH CHECKS');
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Top Navigation */}
        <AdminTopNav />
        
        {/* Main Content Area with Sidebar */}
        <div className="flex flex-1 overflow-hidden" style={{ display: 'flex' }}>
          {/* Sidebar Navigation */}
          <AdminSidebar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    );
  }

  // Show loading state while auth is being checked (only if not in dev mode)
  if (isLoading || !authStable) {
    console.log('AdminLayout: Waiting for auth to stabilize');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin interface...</p>
        </div>
      </div>
    );
  }

  // Check if user is properly authenticated as admin (only if not in dev mode)
  if (!user || !session || userType !== 'admin') {
    console.log('AdminLayout: Access denied - not authenticated as admin:', {
      hasUser: !!user,
      hasSession: !!session,
      userType,
      isDevelopment,
      isDevModeActive,
      devMode
    });
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this area.</p>
        </div>
      </div>
    );
  }

  console.log('AdminLayout: Normal auth flow - user authenticated as admin');

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation */}
      <AdminTopNav />
      
      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden" style={{ display: 'flex' }}>
        {/* Sidebar Navigation */}
        <AdminSidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

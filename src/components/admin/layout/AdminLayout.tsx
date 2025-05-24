
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import AdminSidebar from './AdminSidebar';
import DevRoleSwitcher from '@/components/development/DevRoleSwitcher';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { DevAuthService } from '@/services/DevAuthService';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isDevModeActive, devMode, isDevelopment, isInitialized } = useDevelopmentMode();
  const { user, session, isLoading, userType } = useAuth();
  
  // Get effective auth state (dev bypass or real auth)
  const effectiveAuth = DevAuthService.getEffectiveAuthState(
    user,
    session,
    !!user && !!session,
    isDevelopment,
    isDevModeActive,
    devMode
  );
  
  console.log('AdminLayout: Auth state', {
    isDevelopment,
    isDevModeActive,
    devMode,
    effectiveAuth,
    realAuth: { user: !!user, session: !!session, userType }
  });

  // Show loading state while auth is being checked (but not in dev mode)
  if (isLoading && !DevAuthService.shouldBypassAuth(isDevelopment, isDevModeActive, devMode)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin interface...</p>
        </div>
      </div>
    );
  }

  // Check if user is properly authenticated as admin (with dev bypass)
  if (!effectiveAuth.isAuthenticated || effectiveAuth.userType !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this area.</p>
          {isDevelopment && (
            <p className="text-sm text-orange-600 mt-2">
              Tip: Use the dev mode toggle to switch to admin user type for testing
            </p>
          )}
        </div>
      </div>
    );
  }

  // Render admin interface
  return (
    <>
      <div className="fixed inset-0 flex flex-col bg-gray-100">
        <AdminTopNav />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Use Outlet for nested routes, fallback to children for direct usage */}
              <Outlet />
              {children}
            </div>
          </main>
        </div>
      </div>
      {/* Add DevRoleSwitcher for admin pages */}
      {isDevelopment && isInitialized && <DevRoleSwitcher />}
    </>
  );
};

export default AdminLayout;

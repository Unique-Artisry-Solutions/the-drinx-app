
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import AdminSidebar from './AdminSidebar';
import { useDevelopmentMode } from '@/hooks/useDevelopmentMode';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isDevModeActive, devMode } = useDevelopmentMode();
  const { user, session, isLoading, authStable, userType } = useAuth();
  
  // Log to confirm layout is rendering
  React.useEffect(() => {
    console.log('AdminLayout rendering with children:', !!children);
    console.log('Development mode state:', { isDevModeActive, devMode });
  }, [children, isDevModeActive, devMode]);

  // In development mode with admin role, bypass all auth checks
  if (isDevModeActive && devMode === 'admin') {
    console.log('AdminLayout: Development mode active, rendering admin interface');
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

  // Show loading state while auth is being checked
  if (isLoading || !authStable) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin interface...</p>
        </div>
      </div>
    );
  }

  // Check if user is properly authenticated as admin
  if (!user || !session || userType !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this area.</p>
        </div>
      </div>
    );
  }

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

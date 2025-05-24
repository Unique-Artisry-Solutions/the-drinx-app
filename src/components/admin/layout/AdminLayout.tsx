
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
  const { isDevModeActive, devMode, isDevelopment } = useDevelopmentMode();
  const { user, session, isLoading, userType } = useAuth();
  
  // SIMPLE DEV MODE BYPASS: If in dev mode with admin role, render directly
  if (isDevelopment && isDevModeActive && devMode === 'admin') {
    console.log('AdminLayout: Dev mode bypass - rendering admin interface');
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <AdminTopNav />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-auto p-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    );
  }

  // Show loading state while auth is being checked
  if (isLoading) {
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

  // Normal authenticated admin flow
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <AdminTopNav />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminLayoutProvider } from './AdminLayoutProvider';
import AdminSidebar from './AdminSidebar';
import TopNavigation from '@/components/TopNavigation';
import ImpersonationErrorBoundary from '@/components/admin/ImpersonationErrorBoundary';

interface StreamlinedAdminLayoutProps {
  children?: React.ReactNode;
}

const StreamlinedAdminLayout: React.FC<StreamlinedAdminLayoutProps> = ({ children }) => {
  return (
    <ImpersonationErrorBoundary>
      <AdminLayoutProvider>
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNavigation />
            <main className="flex-1 overflow-y-auto">
              {children || <Outlet />}
            </main>
          </div>
        </div>
      </AdminLayoutProvider>
    </ImpersonationErrorBoundary>
  );
};

export default StreamlinedAdminLayout;

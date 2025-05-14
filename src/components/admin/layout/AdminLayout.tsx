
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Log to confirm layout is rendering
  React.useEffect(() => {
    console.log('AdminLayout rendering with children:', !!children);
  }, [children]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation */}
      <AdminTopNav />
      
      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden" style={{ display: 'flex' }}>
        {/* Sidebar Navigation - Add important display styles */}
        <div className="sidebar-container" style={{ display: 'block', minWidth: '16rem', width: '16rem', height: '100%' }}>
          <AdminSidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

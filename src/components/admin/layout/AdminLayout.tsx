
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { isAdminAuthenticated } from '@/utils/adminAuth';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Check authentication first
  React.useEffect(() => {
    if (!isAdminAuthenticated()) {
      console.log('Not authenticated as admin, redirecting');
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation */}
      <AdminHeader />
      
      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
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

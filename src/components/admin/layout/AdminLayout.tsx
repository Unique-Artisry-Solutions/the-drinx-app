
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

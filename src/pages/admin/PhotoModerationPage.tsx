
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import PhotoModeration from '@/components/admin/PhotoModeration';

const PhotoModerationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Check if user is authenticated as admin
  React.useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />
      <div className="container max-w-7xl mx-auto p-4 pt-8">
        <PhotoModeration />
      </div>
    </div>
  );
};

export default PhotoModerationPage;

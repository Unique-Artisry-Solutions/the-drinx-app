
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentFlags from '@/components/admin/ContentFlags';

const ContentModerationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Check if user is authenticated as admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <ContentFlags />
    </div>
  );
};

export default ContentModerationPage;

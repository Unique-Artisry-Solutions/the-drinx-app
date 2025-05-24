
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoModeration from '@/components/admin/PhotoModeration';

const PhotoModerationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Add debugging
  console.log('PhotoModerationPage: Component rendered');
  
  // Check if user is authenticated as admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <PhotoModeration />
    </div>
  );
};

export default PhotoModerationPage;

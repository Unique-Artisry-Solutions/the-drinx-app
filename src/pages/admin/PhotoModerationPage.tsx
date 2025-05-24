
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoModeration from '@/components/admin/PhotoModeration';

const PhotoModerationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Add debugging
  console.log('PhotoModerationPage: Component rendered at path');
  console.log('PhotoModerationPage: Current URL:', window.location.pathname);
  
  // Check if user is authenticated as admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    console.log('PhotoModerationPage: Admin check:', isAdmin);
    if (!isAdmin) {
      console.log('PhotoModerationPage: Not admin, redirecting');
      navigate('/admin');
    }
  }, [navigate]);

  console.log('PhotoModerationPage: Rendering PhotoModeration component');

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <PhotoModeration />
    </div>
  );
};

export default PhotoModerationPage;

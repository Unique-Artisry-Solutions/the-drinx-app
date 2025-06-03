
import React from 'react';
import PhotoModeration from '@/components/admin/PhotoModeration';

const PhotoModerationPage: React.FC = () => {
  // Add debugging
  console.log('PhotoModerationPage: Component rendered for path:', window.location.pathname);
  console.log('PhotoModerationPage: Rendering PhotoModeration component');

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <PhotoModeration />
    </div>
  );
};

export default PhotoModerationPage;

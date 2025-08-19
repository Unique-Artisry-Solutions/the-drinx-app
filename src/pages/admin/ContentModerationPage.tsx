
import React from 'react';
import ContentFlags from '@/components/admin/ContentFlags';

const ContentModerationPage: React.FC = () => {
  // Debug logging to track component rendering
  console.log('ContentModerationPage: Component rendered for path:', window.location.pathname);
  console.log('ContentModerationPage: Rendering ContentFlags component');

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <ContentFlags />
    </div>
  );
};

export default ContentModerationPage;

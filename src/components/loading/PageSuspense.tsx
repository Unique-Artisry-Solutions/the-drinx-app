
import React from 'react';

export interface PageSuspenseProps {
  children?: React.ReactNode;
}

const PageSuspense: React.FC<PageSuspenseProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
        <div className="h-4 w-56 bg-gray-200 rounded"></div>
      </div>
      {children}
    </div>
  );
};

export default PageSuspense;

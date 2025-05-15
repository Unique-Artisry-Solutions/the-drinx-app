
import React from 'react';

export interface PageSuspenseProps {
  children?: React.ReactNode;
}

const PageSuspense: React.FC<PageSuspenseProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Loading...</p>
        {children}
      </div>
    </div>
  );
};

export default PageSuspense;

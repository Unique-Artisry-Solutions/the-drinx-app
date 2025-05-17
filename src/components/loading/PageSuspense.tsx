
import React from 'react';

export interface PageSuspenseProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

// A simple wrapper component for React.Suspense with a more meaningful name for pages
export const PageSuspense: React.FC<PageSuspenseProps> = ({ children, fallback }) => {
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
};


import React, { Suspense } from 'react';
import PageSkeleton from './skeletons/PageSkeleton';

interface PageSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Page-level suspense boundary with standardized fallback UI
 */
const PageSuspense: React.FC<PageSuspenseProps> = ({ children, fallback }) => {
  return (
    <Suspense fallback={fallback || <PageSkeleton />}>
      {children}
    </Suspense>
  );
};

export default PageSuspense;

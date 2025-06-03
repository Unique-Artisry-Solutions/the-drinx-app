
import React from 'react';
import { Layout } from '@/components/Layout';

const LoadingState: React.FC = () => {
  return (
    <Layout>
      <div className="py-4 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </Layout>
  );
};

export default LoadingState;

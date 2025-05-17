
import React from 'react';
import DesktopLayout from '@/components/layout/DesktopLayout';

const SystemBreakdownPage: React.FC = () => {
  return (
    <DesktopLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">System Breakdown</h1>
        <div className="bg-gray-100 p-6 rounded-lg">
          <p className="text-lg">
            This page will contain the system breakdown analytics and features.
          </p>
        </div>
      </div>
    </DesktopLayout>
  );
};

export default SystemBreakdownPage;

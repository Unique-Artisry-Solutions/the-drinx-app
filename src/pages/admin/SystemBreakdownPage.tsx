
import React from 'react';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { SystemBreakdownContent } from '@/components/admin/systemBreakdown/SystemBreakdownContent';
import { RouteTestRunner } from '@/components/development/RouteTestRunner';

export const SystemBreakdownPage: React.FC = () => {
  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <SystemBreakdownContent />
        
        {/* Add Route Testing Component in Development */}
        <RouteTestRunner />
      </div>
    </ResponsiveLayout>
  );
};

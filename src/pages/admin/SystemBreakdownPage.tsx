
import React from 'react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import SystemBreakdownContentSimple from '@/components/admin/systemBreakdown/SystemBreakdownContentSimple';
import RouteTestRunner from '@/components/development/RouteTestRunner';

const SystemBreakdownPage: React.FC = () => {
  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <SystemBreakdownContentSimple />
        
        {/* Add Route Testing Component in Development */}
        <RouteTestRunner />
      </div>
    </ResponsiveLayout>
  );
};

export default SystemBreakdownPage;

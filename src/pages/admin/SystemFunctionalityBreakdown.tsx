
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import SystemBreakdownContent from '@/components/admin/systemBreakdown/SystemBreakdownContent';

const SystemFunctionalityBreakdown: React.FC = () => {
  // Add debugging
  console.log('SystemFunctionalityBreakdown: Component rendered');
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Tabs defaultValue="overview" className="w-full">
        <SystemBreakdownContent />
      </Tabs>
    </div>
  );
};

export default SystemFunctionalityBreakdown;

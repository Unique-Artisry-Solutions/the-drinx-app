
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './OverviewTab';
import SystemHeader from './SystemHeader';

const SystemBreakdownContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <SystemHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemBreakdownContent;

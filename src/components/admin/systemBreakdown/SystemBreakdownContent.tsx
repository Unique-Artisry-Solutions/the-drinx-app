
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './OverviewTab';
import SystemHeader from './SystemHeader';
import { useSystemBreakdown } from './hooks/useSystemBreakdown';

const SystemBreakdownContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    handleAnalyzeFeatures, 
    handleExportCSV, 
    analyzing 
  } = useSystemBreakdown();

  return (
    <div className="space-y-6">
      <SystemHeader 
        onAnalyzeFeatures={handleAnalyzeFeatures}
        onExportCSV={handleExportCSV}
        analyzing={analyzing}
      />
      
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


import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemOverviewTab from './SystemOverviewTab';
import PerformanceMetricsTab from './PerformanceMetricsTab';
import CacheManagementTab from './CacheManagementTab';
import { UserPreferencesTab } from './preferences/UserPreferencesTab';

const RewardsSystemMonitor = () => {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">System Overview</TabsTrigger>
        <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        <TabsTrigger value="cache">Cache Management</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <SystemOverviewTab />
      </TabsContent>

      <TabsContent value="performance">
        <PerformanceMetricsTab />
      </TabsContent>

      <TabsContent value="cache">
        <CacheManagementTab />
      </TabsContent>

      <TabsContent value="preferences">
        <UserPreferencesTab />
      </TabsContent>
    </Tabs>
  );
};

export default RewardsSystemMonitor;

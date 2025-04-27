
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from '@/components/admin/AdminHeader';
import SystemOverviewTab from '@/components/admin/rewards/SystemOverviewTab';
import PerformanceMetricsTab from '@/components/admin/rewards/PerformanceMetricsTab';
import CacheManagementTab from '@/components/admin/rewards/CacheManagementTab';

const RewardSystemMonitorPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader onLogout={() => {}} />
      <div className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Reward System Monitor</h1>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="cache">Cache Management</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default RewardSystemMonitorPage;

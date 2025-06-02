
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemOverviewTab from '@/components/admin/rewards/SystemOverviewTab';
import PerformanceMetricsTab from '@/components/admin/rewards/PerformanceMetricsTab';
import CacheManagementTab from '@/components/admin/rewards/CacheManagementTab';
import DatabasePerformanceTab from '@/components/admin/rewards/DatabasePerformanceTab';
import { Info, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RewardSystemMonitorPage = () => {
  return (
    <div className="flex flex-col">
      <div className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-4">Reward System Monitor</h1>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              How to Use This Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-semibold text-lg mb-2">System Overview</h3>
                <p className="text-muted-foreground text-sm">
                  Provides a snapshot of the system's current health status, active users, and transaction success rates. 
                  Performance tests show response times for various reward system operations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Performance Metrics</h3>
                <p className="text-muted-foreground text-sm">
                  Visualizes detailed metrics over time, including response times, transaction volumes, 
                  and system resource usage. Use these charts to identify trends or potential issues.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Cache Management</h3>
                <p className="text-muted-foreground text-sm">
                  Monitors the reward system's cache health and performance. Use the invalidation 
                  controls to refresh cached data when needed.
                </p>
              </div>
            </div>
            
            <Alert className="mt-4 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertTitle>Reading Health Status</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  <li><span className="text-green-500 font-medium">Healthy</span>: System is operating normally with optimal response times.</li>
                  <li><span className="text-yellow-500 font-medium">Degraded</span>: System is operational but experiencing slower response times.</li>
                  <li><span className="text-red-500 font-medium">Error</span>: System is experiencing critical issues requiring attention.</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="cache">Cache Management</TabsTrigger>
            <TabsTrigger value="database">Database Performance</TabsTrigger>
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

          <TabsContent value="database">
            <DatabasePerformanceTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RewardSystemMonitorPage;

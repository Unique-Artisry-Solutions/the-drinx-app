
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardProgramConfig } from './config/RewardProgramConfig';
import { BulkOperationsInterface } from './bulk/BulkOperationsInterface';
import { RewardRulesManagement } from './rules/RewardRulesManagement';
import { ProgramStatisticsDashboard } from './analytics/ProgramStatisticsDashboard';
import { ReportExportUtility } from './export/ReportExportUtility';

export function RewardsAdminPage() {
  const [activeTab, setActiveTab] = useState('config');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Rewards Program Administration</h1>
        <p className="text-muted-foreground">
          Manage your rewards program configuration, rules, statistics, and reports.
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="rules">Rules Management</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="reports">Export Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config">
          <RewardProgramConfig />
        </TabsContent>
        
        <TabsContent value="rules">
          <RewardRulesManagement />
        </TabsContent>
        
        <TabsContent value="bulk">
          <BulkOperationsInterface />
        </TabsContent>
        
        <TabsContent value="statistics">
          <ProgramStatisticsDashboard />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportExportUtility />
        </TabsContent>
      </Tabs>
    </div>
  );
}

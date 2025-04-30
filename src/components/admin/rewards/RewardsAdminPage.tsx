
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardProgramConfig } from './config/RewardProgramConfig';
import { BulkOperationsInterface } from './bulk/BulkOperationsInterface';
import { RewardRulesManagement } from './rules/RewardRulesManagement';
import { ProgramStatisticsDashboard } from './analytics/ProgramStatisticsDashboard';
import { ReportExportUtility } from './export/ReportExportUtility';
import { RewardsAdminGuide } from './help/RewardsAdminGuide';
import SystemOverviewTab from './SystemOverviewTab';
import { UserManagementTab } from './users/UserManagementTab';
import { TierManagementTab } from './tiers/TierManagementTab';
import { RewardOfferingsTab } from './offerings/RewardOfferingsTab';
import { CampaignManagementTab } from './campaigns/CampaignManagementTab';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RewardsAdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Rewards Program Administration</h1>
        <p className="text-muted-foreground">
          Manage your rewards program configuration, rules, statistics, and reports.
        </p>
      </div>
      
      <RewardsAdminGuide />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <ScrollArea className="whitespace-nowrap">
            <TabsList className="w-max px-1 py-1">
              <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
              <TabsTrigger value="users" className="text-sm">Users</TabsTrigger>
              <TabsTrigger value="tiers" className="text-sm">Tiers</TabsTrigger>
              <TabsTrigger value="offerings" className="text-sm">Offerings</TabsTrigger>
              <TabsTrigger value="campaigns" className="text-sm">Campaigns</TabsTrigger>
              <TabsTrigger value="config" className="text-sm">Config</TabsTrigger>
              <TabsTrigger value="rules" className="text-sm">Rules</TabsTrigger>
              <TabsTrigger value="bulk" className="text-sm">Bulk Ops</TabsTrigger>
              <TabsTrigger value="statistics" className="text-sm">Stats</TabsTrigger>
              <TabsTrigger value="reports" className="text-sm">Reports</TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>
        
        <TabsContent value="overview">
          <SystemOverviewTab />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTab />
        </TabsContent>

        <TabsContent value="tiers">
          <TierManagementTab />
        </TabsContent>
        
        <TabsContent value="offerings">
          <RewardOfferingsTab />
        </TabsContent>
        
        <TabsContent value="campaigns">
          <CampaignManagementTab />
        </TabsContent>
        
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


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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

export function RewardsAdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Navigation items for consistent reference
  const navigationItems = [
    { value: 'overview', label: 'Overview' },
    { value: 'users', label: 'Users' },
    { value: 'tiers', label: 'Tiers' },
    { value: 'offerings', label: 'Offerings' },
    { value: 'campaigns', label: 'Campaigns' },
    { value: 'config', label: 'Config' },
    { value: 'rules', label: 'Rules' },
    { value: 'bulk', label: 'Bulk Ops' },
    { value: 'statistics', label: 'Stats' },
    { value: 'reports', label: 'Reports' }
  ];
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
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
        {/* Mobile dropdown navigation */}
        <div className="md:hidden mb-4">
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {navigationItems.map(item => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tablet/Desktop navigation */}
        <div className="hidden md:flex md:flex-row md:justify-between border-b mb-4">
          <TabsList className="hidden md:flex">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="users" className="text-sm">Users</TabsTrigger>
            <TabsTrigger value="tiers" className="text-sm">Tiers</TabsTrigger>
            <TabsTrigger value="offerings" className="text-sm">Offerings</TabsTrigger>
            <TabsTrigger value="campaigns" className="text-sm">Campaigns</TabsTrigger>
          </TabsList>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-4 py-2 text-sm border rounded-md md:ml-2">
              More <ChevronDown className="h-4 w-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setActiveTab('config')}>
                Config
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('rules')}>
                Rules
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('bulk')}>
                Bulk Ops
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('statistics')}>
                Stats
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab('reports')}>
                Reports
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

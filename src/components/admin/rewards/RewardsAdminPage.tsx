
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";

interface TabOption {
  value: string;
  label: string;
}

export function RewardsAdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Primary tabs to show on tablet view (most commonly used)
  const primaryTabs: TabOption[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'users', label: 'Users' },
    { value: 'tiers', label: 'Tiers' },
    { value: 'offerings', label: 'Rewards' },
    { value: 'campaigns', label: 'Campaigns' },
  ];
  
  // Secondary tabs to show in the "More" dropdown
  const secondaryTabs: TabOption[] = [
    { value: 'config', label: 'Configuration' },
    { value: 'rules', label: 'Rules' },
    { value: 'bulk', label: 'Bulk Operations' },
    { value: 'statistics', label: 'Statistics' },
    { value: 'reports', label: 'Export Reports' },
  ];
  
  // All tabs combined for mobile dropdown
  const allTabs = [...primaryTabs, ...secondaryTabs];
  
  // Handle tab change from any source
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const renderMobileNavigation = () => {
    return (
      <div className="w-full mb-4">
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select View" />
          </SelectTrigger>
          <SelectContent>
            {allTabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };
  
  const renderTabletDesktopNavigation = () => {
    return (
      <div className="flex items-center mb-4 overflow-x-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
          <TabsList className="mb-0">
            {primaryTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              More <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {secondaryTabs.map((tab) => (
              <DropdownMenuItem 
                key={tab.value} 
                onClick={() => handleTabChange(tab.value)}
                className={activeTab === tab.value ? "bg-accent" : ""}
              >
                {tab.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
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
      
      {/* Responsive Navigation */}
      {isMobile ? renderMobileNavigation() : renderTabletDesktopNavigation()}
      
      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'overview' && <SystemOverviewTab />}
        {activeTab === 'users' && <UserManagementTab />}
        {activeTab === 'tiers' && <TierManagementTab />}
        {activeTab === 'offerings' && <RewardOfferingsTab />}
        {activeTab === 'campaigns' && <CampaignManagementTab />}
        {activeTab === 'config' && <RewardProgramConfig />}
        {activeTab === 'rules' && <RewardRulesManagement />}
        {activeTab === 'bulk' && <BulkOperationsInterface />}
        {activeTab === 'statistics' && <ProgramStatisticsDashboard />}
        {activeTab === 'reports' && <ReportExportUtility />}
      </div>
    </div>
  );
}

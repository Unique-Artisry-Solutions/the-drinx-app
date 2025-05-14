
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface SystemBreakdownNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SystemBreakdownNavigation: React.FC<SystemBreakdownNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="sticky top-4 z-10 bg-card rounded-lg p-1 shadow-sm mb-6 overflow-x-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start gap-1 bg-transparent p-1">
          <TabsTrigger 
            value="overview" 
            className={cn("flex-shrink-0", activeTab === 'overview' ? "bg-primary text-primary-foreground" : "")}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="admin" 
            className={cn("flex-shrink-0", activeTab === 'admin' ? "bg-primary text-primary-foreground" : "")}
          >
            Admin
          </TabsTrigger>
          <TabsTrigger 
            value="establishment" 
            className={cn("flex-shrink-0", activeTab === 'establishment' ? "bg-primary text-primary-foreground" : "")}
          >
            Establishments
          </TabsTrigger>
          <TabsTrigger 
            value="individual" 
            className={cn("flex-shrink-0", activeTab === 'individual' ? "bg-primary text-primary-foreground" : "")}
          >
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="promoter" 
            className={cn("flex-shrink-0", activeTab === 'promoter' ? "bg-primary text-primary-foreground" : "")}
          >
            Promoters
          </TabsTrigger>
          <TabsTrigger 
            value="promoter-requirements" 
            className={cn("flex-shrink-0", activeTab === 'promoter-requirements' ? "bg-primary text-primary-foreground" : "")}
          >
            Requirements
          </TabsTrigger>
          <TabsTrigger 
            value="improvements" 
            className={cn("flex-shrink-0", activeTab === 'improvements' ? "bg-primary text-primary-foreground" : "")}
          >
            Improvements
          </TabsTrigger>
          <TabsTrigger 
            value="releases" 
            className={cn("flex-shrink-0", activeTab === 'releases' ? "bg-primary text-primary-foreground" : "")}
          >
            Releases
          </TabsTrigger>
          <TabsTrigger 
            value="showcase" 
            className={cn("flex-shrink-0", activeTab === 'showcase' ? "bg-primary text-primary-foreground" : "")}
          >
            Showcase
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

// Mobile version with scrollable buttons
const MobileSystemBreakdownNavigation: React.FC<SystemBreakdownNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {['overview', 'admin', 'establishment', 'individual', 'promoter', 'promoter-requirements', 'improvements', 'releases', 'showcase'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-1 text-sm rounded-full whitespace-nowrap",
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};

export { MobileSystemBreakdownNavigation };
export default SystemBreakdownNavigation;

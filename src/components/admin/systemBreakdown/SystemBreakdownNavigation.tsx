
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface SystemBreakdownNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SystemBreakdownNavigation: React.FC<SystemBreakdownNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    // Update the UI state
    setActiveTab(value);
    
    // Update URL without causing a page refresh
    navigate(`/admin/system-breakdown?tab=${value}`, { replace: true });
  };
  
  return (
    <div className="sticky top-4 z-10 bg-card rounded-lg p-1 shadow-sm mb-6 overflow-x-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start gap-1 bg-transparent p-1">
          {['overview', 'admin', 'establishment', 'individual', 'promoter', 'promoter-requirements', 'improvements', 'releases', 'showcase'].map((tab) => (
            <TabsTrigger 
              key={tab}
              value={tab}
              className={cn("flex-shrink-0", activeTab === tab ? "bg-primary text-primary-foreground" : "")}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </TabsTrigger>
          ))}
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
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    // Update the UI state
    setActiveTab(value);
    
    // Update URL without causing a page refresh
    navigate(`/admin/system-breakdown?tab=${value}`, { replace: true });
  };
  
  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {['overview', 'admin', 'establishment', 'individual', 'promoter', 'promoter-requirements', 'improvements', 'releases', 'showcase'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
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

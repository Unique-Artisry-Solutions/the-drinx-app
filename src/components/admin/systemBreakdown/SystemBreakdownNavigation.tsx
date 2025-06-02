
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SystemBreakdownNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SystemBreakdownNavigation: React.FC<SystemBreakdownNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  const isMobile = useIsMobile();

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'admin', label: 'Admin' },
    { value: 'establishment', label: 'Establishments' },
    { value: 'individual', label: 'Users' },
    { value: 'promoter', label: 'Promoters' },
    { value: 'promoter-requirements', label: 'Requirements' },
    { value: 'improvements', label: 'Improvements' },
    { value: 'releases', label: 'Releases' },
    { value: 'showcase', label: 'Showcase' }
  ];

  if (isMobile) {
    return (
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex space-x-2 min-w-max px-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-3 py-2 text-sm rounded-full whitespace-nowrap transition-colors",
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-background border border-border hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-4 z-10 bg-card rounded-lg p-1 shadow-sm mb-6 overflow-x-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start gap-1 bg-transparent p-1">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value}
              className={cn(
                "flex-shrink-0 transition-colors",
                activeTab === tab.value ? "bg-primary text-primary-foreground" : ""
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SystemBreakdownNavigation;

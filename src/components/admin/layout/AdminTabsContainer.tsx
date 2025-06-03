
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminTabs } from '@/hooks/admin/useAdminTabs';
import { AdminTabConfiguration } from '@/types/admin/TabTypes';

interface AdminTabsContainerProps {
  configuration: AdminTabConfiguration;
  children: React.ReactNode;
  className?: string;
}

const AdminTabsContainer: React.FC<AdminTabsContainerProps> = ({
  configuration,
  children,
  className = ''
}) => {
  const { state, actions, allTabs, primaryTabs, secondaryTabs } = useAdminTabs(configuration);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  // Check for overflow on desktop
  useEffect(() => {
    const checkOverflow = () => {
      if (tabsListRef.current && !state.isMobile && !state.isTablet) {
        const element = tabsListRef.current;
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [state.isMobile, state.isTablet, allTabs]);

  // Mobile: Dropdown selector
  if (state.isMobile) {
    const activeTab = allTabs.find(tab => tab.value === state.activeTab);

    return (
      <div className={`w-full ${className}`}>
        <div className="mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  {activeTab?.icon && <activeTab.icon className="h-4 w-4" />}
                  <span>{activeTab?.label}</span>
                  {activeTab?.badge && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {activeTab.badge}
                    </span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {allTabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => actions.setActiveTab(tab.value)}
                  disabled={tab.disabled}
                  className="flex items-center gap-2 w-full"
                >
                  {tab.icon && <tab.icon className="h-4 w-4" />}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                      {tab.badge}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    );
  }

  // Tablet: Scrollable horizontal tabs
  if (state.isTablet) {
    return (
      <Tabs 
        value={state.activeTab} 
        onValueChange={actions.setActiveTab}
        className={`w-full ${className}`}
      >
        <div className="w-full overflow-x-auto">
          <TabsList className="flex w-max min-w-full h-auto p-1 bg-gray-100">
            {allTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                className="flex items-center gap-2 py-3 px-4 text-sm font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="mt-6">
          {children}
        </div>
      </Tabs>
    );
  }

  // Desktop: Horizontal tabs with overflow handling
  const visibleTabs = isOverflowing ? primaryTabs.slice(0, 4) : primaryTabs;
  const overflowTabs = isOverflowing ? [...primaryTabs.slice(4), ...secondaryTabs] : secondaryTabs;

  return (
    <Tabs 
      value={state.activeTab} 
      onValueChange={actions.setActiveTab}
      className={`w-full ${className}`}
    >
      <div className="flex items-center gap-2">
        <TabsList ref={tabsListRef} className="flex h-auto p-1 bg-gray-100">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {overflowTabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MoreHorizontal className="h-4 w-4" />
                <span className="text-sm">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {overflowTabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => actions.setActiveTab(tab.value)}
                  disabled={tab.disabled}
                  className="flex items-center gap-2"
                >
                  {tab.icon && <tab.icon className="h-4 w-4" />}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                      {tab.badge}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="mt-6">
        {children}
      </div>
    </Tabs>
  );
};

export default AdminTabsContainer;

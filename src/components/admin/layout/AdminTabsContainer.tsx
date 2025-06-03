
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdminTabConfig, AdminTabConfiguration } from '@/types/admin/TabTypes';
import { useAdminTabs } from '@/hooks/admin/useAdminTabs';

interface AdminTabsContainerProps {
  configuration: AdminTabConfiguration;
  children: React.ReactNode;
  className?: string;
}

const TabButton: React.FC<{
  tab: AdminTabConfig;
  isActive: boolean;
  onClick: () => void;
  variant?: 'mobile' | 'desktop';
}> = ({ tab, isActive, onClick, variant = 'desktop' }) => {
  const baseClasses = variant === 'mobile' 
    ? "w-full justify-start px-4 py-3 text-left"
    : "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors";
  
  const activeClasses = variant === 'mobile'
    ? "bg-blue-50 text-blue-700"
    : isActive 
      ? "border-blue-500 text-blue-600 bg-blue-50" 
      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <Button
      variant="ghost"
      className={`${baseClasses} ${activeClasses}`}
      onClick={onClick}
      disabled={tab.disabled}
    >
      {tab.icon && <tab.icon className="h-4 w-4" />}
      <span>{tab.label}</span>
      {tab.badge && (
        <Badge variant="secondary" className="ml-auto">
          {tab.badge}
        </Badge>
      )}
    </Button>
  );
};

const MobileTabsDropdown: React.FC<{
  tabs: AdminTabConfig[];
  activeTab: string;
  onTabChange: (value: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => {
  const activeTabData = tabs.find(tab => tab.value === activeTab);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            {activeTabData?.icon && <activeTabData.icon className="h-4 w-4" />}
            <span>{activeTabData?.label || 'Select Tab'}</span>
            {activeTabData?.badge && (
              <Badge variant="secondary">{activeTabData.badge}</Badge>
            )}
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {tabs.map((tab) => (
          <DropdownMenuItem
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            disabled={tab.disabled}
            className="flex items-center gap-2"
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            <span>{tab.label}</span>
            {tab.badge && (
              <Badge variant="secondary" className="ml-auto">
                {tab.badge}
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DesktopTabs: React.FC<{
  tabs: AdminTabConfig[];
  activeTab: string;
  onTabChange: (value: string) => void;
  maxVisible?: number;
}> = ({ tabs, activeTab, onTabChange, maxVisible = 6 }) => {
  const [overflowTabs, setOverflowTabs] = useState<AdminTabConfig[]>([]);
  const [visibleTabs, setVisibleTabs] = useState<AdminTabConfig[]>(tabs);

  useEffect(() => {
    if (tabs.length > maxVisible) {
      setVisibleTabs(tabs.slice(0, maxVisible));
      setOverflowTabs(tabs.slice(maxVisible));
    } else {
      setVisibleTabs(tabs);
      setOverflowTabs([]);
    }
  }, [tabs, maxVisible]);

  return (
    <div className="flex items-center">
      <div className="flex">
        {visibleTabs.map((tab) => (
          <TabButton
            key={tab.value}
            tab={tab}
            isActive={activeTab === tab.value}
            onClick={() => onTabChange(tab.value)}
            variant="desktop"
          />
        ))}
      </div>
      
      {overflowTabs.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {overflowTabs.map((tab) => (
              <DropdownMenuItem
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                disabled={tab.disabled}
                className="flex items-center gap-2"
              >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                <span>{tab.label}</span>
                {tab.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {tab.badge}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

const TabletScrollableTabs: React.FC<{
  tabs: AdminTabConfig[];
  activeTab: string;
  onTabChange: (value: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-1 pb-2">
        {tabs.map((tab) => (
          <TabButton
            key={tab.value}
            tab={tab}
            isActive={activeTab === tab.value}
            onClick={() => onTabChange(tab.value)}
            variant="desktop"
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export const AdminTabsContainer: React.FC<AdminTabsContainerProps> = ({
  configuration,
  children,
  className = ''
}) => {
  const { state, actions, primaryTabs, secondaryTabs } = useAdminTabs(configuration);
  const responsiveBehavior = configuration.responsive;

  const renderTabs = () => {
    if (state.isMobile) {
      const behavior = responsiveBehavior.mobile;
      
      if (behavior === 'dropdown') {
        return (
          <div className="mb-6">
            <MobileTabsDropdown
              tabs={primaryTabs}
              activeTab={state.activeTab}
              onTabChange={actions.setActiveTab}
            />
          </div>
        );
      }
    }

    if (state.isTablet) {
      const behavior = responsiveBehavior.tablet;
      
      if (behavior === 'scrollable') {
        return (
          <div className="mb-6">
            <TabletScrollableTabs
              tabs={primaryTabs}
              activeTab={state.activeTab}
              onTabChange={actions.setActiveTab}
            />
          </div>
        );
      }
    }

    // Desktop view
    return (
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <DesktopTabs
            tabs={primaryTabs}
            activeTab={state.activeTab}
            onTabChange={actions.setActiveTab}
          />
        </div>
        
        {secondaryTabs.length > 0 && (
          <div className="mt-4 border-b border-gray-100">
            <DesktopTabs
              tabs={secondaryTabs}
              activeTab={state.activeTab}
              onTabChange={actions.setActiveTab}
              maxVisible={8}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {renderTabs()}
      <div className="tab-content">
        {children}
      </div>
    </div>
  );
};

export default AdminTabsContainer;

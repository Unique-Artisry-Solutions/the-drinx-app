
import React from 'react';
import { AdminTabs, AdminTabConfig } from './AdminTabs';
import { AdminTabConfiguration } from '@/types/admin/TabTypes';
import { updateTabBadges } from '@/utils/admin/tabConfigUtils';

interface AdminTabsContainerProps {
  configuration: AdminTabConfiguration;
  children: React.ReactNode;
  onTabChange?: (tabValue: string) => void;
  className?: string;
}

const AdminTabsContainer: React.FC<AdminTabsContainerProps> = ({
  configuration,
  children,
  onTabChange,
  className = ''
}) => {
  const allTabs: AdminTabConfig[] = [
    ...configuration.groups.primary,
    ...(configuration.groups.secondary || [])
  ];

  const defaultTab = configuration.persistence?.defaultTab || allTabs[0]?.value;

  return (
    <AdminTabs
      tabs={allTabs}
      defaultValue={defaultTab}
      onValueChange={onTabChange}
      className={className}
    >
      {children}
    </AdminTabs>
  );
};

export default AdminTabsContainer;

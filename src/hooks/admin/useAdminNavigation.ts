
import { useMemo } from 'react';
import { AdminTabConfig } from '@/components/admin/layout';
import { AdminTabConfiguration } from '@/types/admin/TabTypes';
import { DASHBOARD_TAB_CONFIG } from '@/config/admin/tabConfigurations';
import { updateTabBadges } from '@/utils/admin/tabConfigUtils';

export interface NavigationConfig {
  tabs: AdminTabConfig[];
  defaultTab?: string;
  configuration?: AdminTabConfiguration;
}

export const useAdminNavigation = (
  establishments: any[] = [],
  cocktails: any[] = [],
  customTabs: AdminTabConfig[] = [],
  useNewTabSystem: boolean = false
) => {
  const navigationConfig: NavigationConfig = useMemo(() => {
    if (useNewTabSystem) {
      // Use the new declarative configuration system
      const configWithBadges = updateTabBadges(DASHBOARD_TAB_CONFIG, {
        establishments: establishments.length,
        cocktails: cocktails.length
      });

      return {
        tabs: [...configWithBadges.groups.primary, ...(configWithBadges.groups.secondary || [])],
        defaultTab: configWithBadges.persistence?.defaultTab,
        configuration: configWithBadges
      };
    }

    // Legacy fallback for existing code
    const defaultTabs: AdminTabConfig[] = [
      {
        value: 'establishments',
        label: 'Establishments',
        badge: establishments.length
      },
      {
        value: 'cocktails',
        label: 'Cocktails',
        badge: cocktails.length
      },
      {
        value: 'promotions',
        label: 'Promotions'
      },
      {
        value: 'reviews',
        label: 'Reviews'
      }
    ];

    return {
      tabs: [...defaultTabs, ...customTabs],
      defaultTab: 'establishments'
    };
  }, [establishments.length, cocktails.length, customTabs, useNewTabSystem]);

  return navigationConfig;
};

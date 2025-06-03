
import { useMemo } from 'react';
import { AdminTabConfig } from '@/components/admin/layout';

export interface NavigationConfig {
  tabs: AdminTabConfig[];
  defaultTab?: string;
}

export const useAdminNavigation = (
  establishments: any[] = [],
  cocktails: any[] = [],
  customTabs: AdminTabConfig[] = []
) => {
  const navigationConfig: NavigationConfig = useMemo(() => {
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
  }, [establishments.length, cocktails.length, customTabs]);

  return navigationConfig;
};


import { AdminTabConfiguration } from '@/types/admin/TabTypes';

export const updateTabBadges = (
  configuration: AdminTabConfiguration,
  badges: Record<string, number>
): AdminTabConfiguration => {
  return {
    ...configuration,
    groups: {
      primary: configuration.groups.primary.map(tab => ({
        ...tab,
        badge: badges[tab.value] ?? tab.badge
      })),
      secondary: configuration.groups.secondary?.map(tab => ({
        ...tab,
        badge: badges[tab.value] ?? tab.badge
      }))
    }
  };
};

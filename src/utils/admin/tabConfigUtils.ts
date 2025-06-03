
import { AdminTabConfiguration, AdminTabConfig } from '@/types/admin/TabTypes';

export const updateTabBadges = (
  configuration: AdminTabConfiguration,
  badgeUpdates: Record<string, string | number>
): AdminTabConfiguration => {
  const updateTabsWithBadges = (tabs: AdminTabConfig[]) =>
    tabs.map(tab => ({
      ...tab,
      badge: badgeUpdates[tab.value] !== undefined ? badgeUpdates[tab.value] : tab.badge
    }));

  return {
    ...configuration,
    groups: {
      primary: updateTabsWithBadges(configuration.groups.primary),
      secondary: configuration.groups.secondary 
        ? updateTabsWithBadges(configuration.groups.secondary)
        : undefined
    }
  };
};

export const enableDisableTabs = (
  configuration: AdminTabConfiguration,
  tabStates: Record<string, boolean>
): AdminTabConfiguration => {
  const updateTabsWithStates = (tabs: AdminTabConfig[]) =>
    tabs.map(tab => ({
      ...tab,
      disabled: tabStates[tab.value] !== undefined ? !tabStates[tab.value] : tab.disabled
    }));

  return {
    ...configuration,
    groups: {
      primary: updateTabsWithStates(configuration.groups.primary),
      secondary: configuration.groups.secondary 
        ? updateTabsWithStates(configuration.groups.secondary)
        : undefined
    }
  };
};

export const findTabByValue = (
  configuration: AdminTabConfiguration,
  value: string
): AdminTabConfig | undefined => {
  const allTabs = [
    ...configuration.groups.primary,
    ...(configuration.groups.secondary || [])
  ];
  return allTabs.find(tab => tab.value === value);
};

export const getTabsByGroup = (
  configuration: AdminTabConfiguration,
  group: 'primary' | 'secondary'
): AdminTabConfig[] => {
  if (group === 'secondary') {
    return configuration.groups.secondary || [];
  }
  return configuration.groups.primary;
};

export const validateTabConfiguration = (configuration: AdminTabConfiguration): string[] => {
  const errors: string[] = [];
  
  if (!configuration.id) {
    errors.push('Configuration must have an id');
  }
  
  if (!configuration.name) {
    errors.push('Configuration must have a name');
  }
  
  if (!configuration.groups.primary.length) {
    errors.push('Configuration must have at least one primary tab');
  }
  
  const allTabs = [
    ...configuration.groups.primary,
    ...(configuration.groups.secondary || [])
  ];
  
  const tabValues = allTabs.map(tab => tab.value);
  const duplicates = tabValues.filter((value, index) => tabValues.indexOf(value) !== index);
  
  if (duplicates.length > 0) {
    errors.push(`Duplicate tab values found: ${duplicates.join(', ')}`);
  }
  
  return errors;
};

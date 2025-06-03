
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminTabConfiguration, UseAdminTabsState, UseAdminTabsActions } from '@/types/admin/TabTypes';

export const useAdminTabs = (configuration: AdminTabConfiguration) => {
  const isMobile = useIsMobile();
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;

  // Get all available tabs
  const allTabs = useMemo(() => {
    return [
      ...configuration.groups.primary,
      ...(configuration.groups.secondary || [])
    ];
  }, [configuration]);

  // Initialize active tab from localStorage or default
  const getInitialTab = useCallback(() => {
    if (configuration.persistence) {
      const stored = localStorage.getItem(configuration.persistence.key);
      if (stored && allTabs.some(tab => tab.value === stored)) {
        return stored;
      }
      return configuration.persistence.defaultTab;
    }
    return allTabs[0]?.value || '';
  }, [configuration, allTabs]);

  const [state, setState] = useState<UseAdminTabsState>({
    activeTab: getInitialTab(),
    previousTab: null,
    isMobile,
    isTablet,
    isOverflowing: false
  });

  // Update responsive state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isMobile,
      isTablet
    }));
  }, [isMobile, isTablet]);

  // Persist tab selection
  useEffect(() => {
    if (configuration.persistence && state.activeTab) {
      localStorage.setItem(configuration.persistence.key, state.activeTab);
    }
  }, [state.activeTab, configuration.persistence]);

  const actions: UseAdminTabsActions = {
    setActiveTab: useCallback((tabValue: string) => {
      if (allTabs.some(tab => tab.value === tabValue && !tab.disabled)) {
        setState(prev => ({
          ...prev,
          previousTab: prev.activeTab,
          activeTab: tabValue
        }));
      }
    }, [allTabs]),

    goToPreviousTab: useCallback(() => {
      if (state.previousTab) {
        setState(prev => ({
          ...prev,
          activeTab: prev.previousTab!,
          previousTab: null
        }));
      }
    }, [state.previousTab]),

    resetToDefault: useCallback(() => {
      const defaultTab = configuration.persistence?.defaultTab || allTabs[0]?.value || '';
      setState(prev => ({
        ...prev,
        activeTab: defaultTab,
        previousTab: prev.activeTab !== defaultTab ? prev.activeTab : null
      }));
    }, [configuration, allTabs]),

    validateTab: useCallback((tabValue: string) => {
      return allTabs.some(tab => tab.value === tabValue && !tab.disabled);
    }, [allTabs])
  };

  return {
    state,
    actions,
    configuration,
    allTabs,
    primaryTabs: configuration.groups.primary,
    secondaryTabs: configuration.groups.secondary || []
  };
};

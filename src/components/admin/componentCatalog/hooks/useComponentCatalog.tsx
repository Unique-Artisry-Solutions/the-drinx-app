
import { useState, useEffect } from 'react';
import { PageComponentsMap } from '../types';

// Simple component catalog data without the complex rewards components
const simpleComponentCatalogData: PageComponentsMap = {
  '/admin/rewards': {
    pageName: 'Rewards Administration',
    description: 'Simple rewards program administration',
    components: [
      {
        groupName: 'Core Components',
        components: [
          {
            name: 'SimpleRewardsDashboard',
            description: 'Basic rewards program dashboard',
            filePath: 'src/components/admin/rewards/SimpleRewardsDashboard.tsx',
            type: 'Component',
            selectors: ['rewards-dashboard', 'admin-rewards']
          },
          {
            name: 'SimpleSystemMonitor',
            description: 'Basic system monitoring for rewards',
            filePath: 'src/components/admin/rewards/SimpleSystemMonitor.tsx',
            type: 'Component',
            selectors: ['system-monitor', 'rewards-monitor']
          }
        ]
      }
    ]
  }
};

export const useComponentCatalog = () => {
  const [componentsByPage, setComponentsByPage] = useState<PageComponentsMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredComponents, setFilteredComponents] = useState<PageComponentsMap>({});
  
  useEffect(() => {
    setComponentsByPage(simpleComponentCatalogData);
    setFilteredComponents(simpleComponentCatalogData);
    setIsLoading(false);
  }, []);
  
  const searchComponents = (query: string) => {
    if (!query.trim()) {
      setFilteredComponents(componentsByPage);
      return;
    }
    
    const lowerCaseQuery = query.toLowerCase();
    const filteredResults: PageComponentsMap = {};
    
    Object.keys(componentsByPage).forEach((pagePath) => {
      const page = componentsByPage[pagePath];
      const matchingGroups = page.components.map(group => {
        const matchingComponents = group.components.filter(component => 
          component.name.toLowerCase().includes(lowerCaseQuery) || 
          component.description.toLowerCase().includes(lowerCaseQuery) ||
          component.filePath.toLowerCase().includes(lowerCaseQuery) ||
          component.type.toLowerCase().includes(lowerCaseQuery) ||
          component.selectors.some(selector => selector.toLowerCase().includes(lowerCaseQuery))
        );
        
        if (matchingComponents.length > 0) {
          return {
            ...group,
            components: matchingComponents
          };
        }
        return null;
      }).filter(Boolean) as any[];
      
      if (matchingGroups.length > 0) {
        filteredResults[pagePath] = {
          ...page,
          components: matchingGroups
        };
      }
    });
    
    setFilteredComponents(filteredResults);
  };
  
  return {
    componentsByPage: filteredComponents,
    isLoading,
    searchComponents
  };
};

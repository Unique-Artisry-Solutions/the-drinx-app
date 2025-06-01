
import { useState, useEffect } from 'react';
import { PageComponentsMap } from '../types';
import { componentCatalogData } from '../data/componentCatalogData';

export const useComponentCatalog = () => {
  const [componentsByPage, setComponentsByPage] = useState<PageComponentsMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredComponents, setFilteredComponents] = useState<PageComponentsMap>({});
  
  useEffect(() => {
    setComponentsByPage(componentCatalogData);
    setFilteredComponents(componentCatalogData);
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

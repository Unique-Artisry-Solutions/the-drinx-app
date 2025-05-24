
import { useState, useMemo } from 'react';
import { FeatureItem } from '../types';

interface SearchFilters {
  query: string;
  status: string;
  complexity: string;
  userImpact: string;
  category: string;
}

export const useAdvancedSearch = (features: FeatureItem[]) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: 'all',
    complexity: 'all',
    userImpact: 'all',
    category: 'all'
  });

  const filteredFeatures = useMemo(() => {
    return features.filter(feature => {
      // Text search
      if (filters.query) {
        const searchText = filters.query.toLowerCase();
        const matchesText = 
          feature.name.toLowerCase().includes(searchText) ||
          feature.description.toLowerCase().includes(searchText) ||
          feature.id.toLowerCase().includes(searchText);
        
        if (!matchesText) return false;
      }

      // Status filter
      if (filters.status !== 'all' && feature.status !== filters.status) {
        return false;
      }

      // Complexity filter
      if (filters.complexity !== 'all' && feature.complexity !== filters.complexity) {
        return false;
      }

      // User impact filter
      if (filters.userImpact !== 'all' && feature.userImpact !== filters.userImpact) {
        return false;
      }

      return true;
    });
  }, [features, filters]);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      status: 'all',
      complexity: 'all',
      userImpact: 'all',
      category: 'all'
    });
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== '' && value !== 'all').length;
  }, [filters]);

  return {
    filters,
    filteredFeatures,
    updateFilter,
    clearFilters,
    activeFilterCount,
    totalResults: filteredFeatures.length,
    totalFeatures: features.length
  };
};


import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search, Filter } from 'lucide-react';
import Fuse from 'fuse.js';

interface SearchFilterProps {
  data: any[];
  onFilter: (filteredData: any[]) => void;
  searchKeys: string[];
  placeholder?: string;
  filters?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  data,
  onFilter,
  searchKeys,
  placeholder = "Search...",
  filters = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Initialize Fuse instance for fuzzy search
  const fuseInstance: Fuse<any> = useMemo(() => new Fuse(data, {
    keys: searchKeys,
    threshold: 0.3,
    includeScore: true
  }), [data, searchKeys]);

  // Apply search and filters
  useEffect(() => {
    let filteredData = data;

    // Apply search
    if (searchTerm.trim()) {
      const searchResults = fuseInstance.search(searchTerm);
      filteredData = searchResults.map(result => result.item);
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue) {
        filteredData = filteredData.filter(item => {
          const itemValue = item[filterKey];
          return itemValue === filterValue || 
                 (Array.isArray(itemValue) && itemValue.includes(filterValue));
        });
      }
    });

    onFilter(filteredData);
  }, [searchTerm, activeFilters, data, onFilter, fuseInstance]);

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const removeFilter = (filterKey: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  const hasActiveFilters = searchTerm || Object.keys(activeFilters).length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      {filters.length > 0 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.keys(activeFilters).length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {Object.keys(activeFilters).length}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Active Filters */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([filterKey, filterValue]) => {
            const filter = filters.find(f => f.key === filterKey);
            const option = filter?.options.find(o => o.value === filterValue);
            
            return (
              <Badge
                key={filterKey}
                variant="secondary"
                className="gap-1"
              >
                {filter?.label}: {option?.label || filterValue}
                <button
                  onClick={() => removeFilter(filterKey)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Filter Options */}
      {showFilters && filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
          {filters.map(filter => (
            <div key={filter.key}>
              <label className="block text-sm font-medium mb-2">
                {filter.label}
              </label>
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;

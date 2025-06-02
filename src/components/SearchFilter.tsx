
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  data: any[];
  onFilterChange: (filteredData: any[]) => void;
  searchFields?: string[];
  filterOptions?: FilterOption[];
  placeholder?: string;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  data,
  onFilterChange,
  searchFields = ['name'],
  filterOptions = [],
  placeholder = "Search...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply active filters
    if (activeFilters.length > 0) {
      result = result.filter(item =>
        activeFilters.every(filter => {
          // Basic filter logic - can be customized based on your needs
          return item.category === filter || item.type === filter;
        })
      );
    }

    return result;
  }, [data, searchTerm, activeFilters, searchFields]);

  React.useEffect(() => {
    onFilterChange(filteredData);
  }, [filteredData, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addFilter = (filterValue: string) => {
    if (!activeFilters.includes(filterValue)) {
      setActiveFilters([...activeFilters, filterValue]);
    }
  };

  const removeFilter = (filterValue: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filterValue));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters([]);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          {/* Filter Dropdown */}
          {filterOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => addFilter(option.value)}
                    disabled={activeFilters.includes(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Active Filters */}
          {(activeFilters.length > 0 || searchTerm) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Filters:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchTerm}"
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchTerm('')}
                    />
                  </Badge>
                )}
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                    {filterOptions.find(opt => opt.value === filter)?.label || filter}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFilter(filter)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} of {data.length} results
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilter;

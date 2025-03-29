
import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilterChange,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25]);
  const [distance, setDistance] = useState<number>(10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleFilterChange = () => {
    onFilterChange({
      priceRange,
      distance,
    });
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-material-outline" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cocktails or establishments..."
            className="w-full pl-10 pr-14 py-3 rounded-full border border-material-outline bg-white focus:outline-none focus:ring-2 focus:ring-material-primary"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 text-material-outline hover:text-material-on-surface"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full",
              showFilters ? "bg-material-primary text-material-on-primary" : "text-material-outline"
            )}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      
        {showFilters && (
          <div className="mt-3 p-4 bg-white rounded-xl elevation-2 animate-slide-down">
            <h4 className="text-sm font-medium text-material-on-surface mb-3">Filters</h4>
            
            <div className="mb-4">
              <label className="text-xs text-material-on-surface-variant block mb-2">
                Maximum Price Range: ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={priceRange[1]}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  setPriceRange([priceRange[0], newValue]);
                  handleFilterChange();
                }}
                className="w-full h-2 bg-material-surface-variant rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="mb-4">
              <label className="text-xs text-material-on-surface-variant block mb-2">
                Maximum Distance: {distance} miles
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={distance}
                onChange={(e) => {
                  setDistance(parseInt(e.target.value));
                  handleFilterChange();
                }}
                className="w-full h-2 bg-material-surface-variant rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <button
              type="button"
              onClick={handleFilterChange}
              className="w-full bg-material-primary text-material-on-primary rounded-full py-2 text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchFilter;

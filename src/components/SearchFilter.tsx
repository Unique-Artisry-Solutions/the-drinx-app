
import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SearchSuggestions from './SearchSuggestions';
import { createFuzzySearch, extractSearchSuggestions, performAdvancedSearch } from '@/utils/searchUtils';
import Fuse from 'fuse.js';

export interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  onApplyFilters: () => void;
  className?: string;
  initialSearchTerm?: string;
  cocktails?: any[];
  establishments?: any[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilterChange,
  onApplyFilters,
  className,
  initialSearchTerm = '',
  cocktails = [],
  establishments = [],
}) => {
  const [query, setQuery] = useState(initialSearchTerm);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25]);
  const [distance, setDistance] = useState<number>(10);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{value: string; label: string; type: 'cocktail' | 'establishment' | 'ingredient'}>>([]);
  const [fuseInstance, setFuseInstance] = useState<Fuse<any> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initialize fuzzy search when cocktails or establishments change
  useEffect(() => {
    if (cocktails.length > 0 || establishments.length > 0) {
      // Combine cocktails and establishments for fuzzy search
      const searchItems = [
        ...cocktails.map(c => ({
          ...c,
          type: 'cocktail',
        })),
        ...establishments.map(e => ({
          ...e,
          type: 'establishment',
        })),
      ];
      
      // Create Fuse instance
      setFuseInstance(createFuzzySearch(searchItems));
      
      // Extract suggestions
      const extractedSuggestions = extractSearchSuggestions(cocktails, establishments);
      setSuggestions(extractedSuggestions);
    }
  }, [cocktails, establishments]);

  useEffect(() => {
    if (initialSearchTerm !== query) {
      setQuery(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  const handleFilterChange = () => {
    onFilterChange({
      priceRange,
      distance,
    });
  };

  const handleApplyFilters = () => {
    handleFilterChange();
    onApplyFilters();
    // Close the filters after applying
    setShowFilters(false);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Show suggestions if there's text and we have suggestions
    if (value.length > 1 && suggestions.length > 0) {
      setShowSuggestions(true);
      
      // Filter suggestions based on input
      const filtered = suggestions.filter(suggestion => 
        suggestion.label.toLowerCase().includes(value.toLowerCase())
      );
      
      setSuggestions(filtered.length > 0 ? filtered : suggestions);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (value: string) => {
    setQuery(value);
    setShowSuggestions(false);
    onSearch(value);
  };

  return (
    <div className={cn("w-full", className)} ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-material-outline" size={20} />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
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
        
        {/* Search Suggestions */}
        <SearchSuggestions 
          suggestions={suggestions}
          isOpen={showSuggestions}
          onSelect={handleSuggestionSelect}
          onOpenChange={setShowSuggestions}
          searchTerm={query}
        />
      
        {showFilters && (
          <div className="mt-3 p-4 bg-white rounded-xl elevation-2 animate-slide-down shadow-md z-10">
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
                }}
                className="w-full h-2 bg-material-surface-variant rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <Button
              type="button"
              onClick={handleApplyFilters}
              className="w-full bg-material-primary text-material-on-primary rounded-full py-2 text-sm font-medium"
            >
              Apply Filters
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchFilter;

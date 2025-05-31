
import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createFuzzySearch, extractSearchSuggestions } from '@/utils/searchUtils';
import SearchInput from './search/SearchInput';
import FilterPanel from './search/FilterPanel';

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
  const [suggestions, setSuggestions] = useState<Array<{value: string; label: string; type: 'cocktail' | 'establishment' | 'ingredient'}>>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initialize fuzzy search when cocktails or establishments change
  useEffect(() => {
    const cocktailItems = cocktails.length > 0 ? cocktails : []; 
    const establishmentItems = establishments.length > 0 ? establishments : [];
    
    if (cocktailItems.length > 0 || establishmentItems.length > 0) {
      const searchItems = [
        ...cocktailItems.map(c => ({
          ...c,
          type: 'cocktail',
        })),
        ...establishmentItems.map(e => ({
          ...e,
          type: 'establishment',
        })),
      ];
      
      createFuzzySearch(searchItems);
      
      const extractedSuggestions = extractSearchSuggestions(cocktailItems, establishmentItems);
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
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (value: string) => {
    console.log('SearchFilter - handleSearch called with:', value);
    onSearch(value);
  };

  const handleFilterChange = () => {
    onFilterChange({
      priceRange,
      distance,
    });
  };

  const handleApplyFilters = () => {
    console.log('SearchFilter - applying filters:', { priceRange, distance });
    handleFilterChange();
    onApplyFilters();
    setShowFilters(false);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={cn("w-full", className)} ref={searchRef}>
      <div className="relative">
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          onClear={clearSearch}
          suggestions={suggestions}
        />
        <button
          type="button"
          onClick={() => {
            console.log('Filter button clicked, current state:', showFilters);
            setShowFilters(!showFilters);
          }}
          className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors",
            "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary",
            showFilters ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>
      
      {showFilters && (
        <FilterPanel
          priceRange={priceRange}
          distance={distance}
          onPriceRangeChange={setPriceRange}
          onDistanceChange={setDistance}
          onApplyFilters={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default SearchFilter;

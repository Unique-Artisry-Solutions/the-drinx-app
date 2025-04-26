
import React from 'react';
import ViewModeToggle from '@/components/ViewModeToggle';
import SearchFilter from '@/components/SearchFilter';

interface MapPageHeaderProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  onFilterChange: (filters: any) => void;
  onApplyFilters: () => void;
  viewMode: 'map' | 'list';
  onViewModeChange: () => void;
  isMobile: boolean;
}

const MapPageHeader = ({
  searchTerm,
  onSearch,
  onFilterChange,
  onApplyFilters,
  viewMode,
  onViewModeChange,
  isMobile
}: MapPageHeaderProps) => {
  return (
    <div className="p-2 sm:p-4 border-b">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Explore Mocktails</h1>
        {!isMobile && (
          <ViewModeToggle 
            viewMode={viewMode === 'MAP' ? 'map' : 'list'} 
            onViewModeChange={onViewModeChange} 
          />
        )}
      </div>
      <SearchFilter 
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        onApplyFilters={onApplyFilters}
        initialSearchTerm={searchTerm}
      />
    </div>
  );
};

export default MapPageHeader;

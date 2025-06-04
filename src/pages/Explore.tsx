
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import LocationSearch from '@/components/LocationSearch';
import ViewModeToggle from '@/components/ViewModeToggle';
import SearchFilter from '@/components/SearchFilter';
import { ExploreMap } from '@/components/explore/ExploreMap';
import { ExploreList } from '@/components/explore/ExploreList';
import { useExploreData } from '@/hooks/useExploreData';
import { ViewMode } from '@/types/ExploreTypes';
import { Establishment } from '@/types/ProfileTypes';
import { Cocktail } from '@/types/ProfileTypes';

const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get('location') || '';
  const initialSearchTerm = searchParams.get('q') || '';
  const initialViewMode = (searchParams.get('view') as ViewMode) || 'list';

  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [filters, setFilters] = useState({});
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);

  const {
    filteredEstablishments,
    filteredCocktails,
    isLoading,
    error,
    searchEstablishments,
    searchCocktails
  } = useExploreData(establishments, cocktails, searchTerm, filters);

  // Update URL params when location or search term changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (locationQuery) params.set('location', locationQuery);
    if (searchTerm) params.set('q', searchTerm);
    if (viewMode && viewMode !== 'list') params.set('view', viewMode);
    setSearchParams(params);
  }, [locationQuery, searchTerm, viewMode, setSearchParams]);

  const handleLocationSearch = (location: string) => {
    setLocationQuery(location);
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
  };

  useEffect(() => {
    // Mock data fetching - replace with actual API calls
    const fetchMockData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock establishments data with required properties
      const mockEstablishments: Establishment[] = [
        { id: '1', name: 'The Mocktail Lounge', address: '123 Main St', latitude: 40.7128, longitude: -74.0060 },
        { id: '2', name: 'Sober Bar & Kitchen', address: '456 Elm St', latitude: 40.7589, longitude: -73.9851 },
        { id: '3', name: 'Dry Spirits', address: '789 Oak St', latitude: 40.7505, longitude: -73.9934 },
      ];

      // Mock cocktails data with required properties
      const mockCocktails: Cocktail[] = [
        { id: '101', name: 'Virgin Mojito', ingredients: ['Lime', 'Mint', 'Soda'], price: 8.99, establishment: 'The Mocktail Lounge' },
        { id: '102', name: 'Shirley Temple', ingredients: ['Ginger Ale', 'Grenadine'], price: 6.99, establishment: 'Sober Bar & Kitchen' },
        { id: '103', name: 'Cranberry Spritzer', ingredients: ['Cranberry Juice', 'Soda'], price: 7.99, establishment: 'Dry Spirits' },
      ];

      setEstablishments(mockEstablishments);
      setCocktails(mockCocktails);
    };

    fetchMockData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <Card className="mb-4">
          <Card className="p-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <LocationSearch onSearch={handleLocationSearch} />
            </div>
            <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
          </Card>
          <SearchFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            initialSearchTerm={searchTerm}
            cocktails={cocktails}
            establishments={establishments}
          />
        </Card>

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">Error: {error}</div>
        ) : (
          <>
            {viewMode === 'map' ? (
              <ExploreMap establishments={filteredEstablishments} />
            ) : (
              <ExploreList
                establishments={filteredEstablishments}
                cocktails={filteredCocktails}
                searchEstablishments={searchEstablishments}
                searchCocktails={searchCocktails}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Explore;

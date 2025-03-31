
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserLocation } from '@/hooks/useUserLocation';
import Fuse from 'fuse.js';
import { performAdvancedSearch, createFuzzySearch } from '@/utils/searchUtils';

// Import sample data
import { sampleCocktails, sampleEstablishments } from '@/data/sampleData';

interface Filters {
  priceRange: [number, number];
  distance: number;
}

export const useIndexPageLogic = () => {
  const [cocktails, setCocktails] = useState(sampleCocktails);
  const [allCocktails, setAllCocktails] = useState(sampleCocktails);
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 25],
    distance: 10
  });
  const [activeTab, setActiveTab] = useState("featured");
  const {
    toast
  } = useToast();
  const {
    userLocation,
    isLoading: isLoadingLocation,
    refreshLocation,
    calculateDistance,
    formatDistance
  } = useUserLocation();

  // Create fuzzy search instance for cocktails
  const fuseInstance = useMemo(() => 
    createFuzzySearch(allCocktails),
    [allCocktails]
  );

  // Calculate distances when user location changes
  useEffect(() => {
    if (userLocation && establishments.length > 0) {
      const updatedEstablishments = establishments.map(est => ({
        ...est,
        distance: formatDistance(calculateDistance(est.latitude, est.longitude))
      }));
      setEstablishments(updatedEstablishments);
    }
  }, [userLocation, establishments, calculateDistance, formatDistance]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Perform advanced search with fuzzy matching and regex
    if (query) {
      const searchResults = performAdvancedSearch(allCocktails, query, fuseInstance);
      setCocktails(searchResults);
    } else {
      setCocktails(allCocktails);
    }
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  const applyFilters = () => {
    // Start with all cocktails or current search results
    let filteredCocktails = searchQuery ? 
      performAdvancedSearch(allCocktails, searchQuery, fuseInstance) : 
      [...allCocktails];
    
    // Apply price range filter
    filteredCocktails = filteredCocktails.filter(cocktail => {
      const cocktailPrice = typeof cocktail.price === 'string' 
        ? parseFloat(cocktail.price) 
        : cocktail.price;
      
      return !isNaN(cocktailPrice) && 
        cocktailPrice >= filters.priceRange[0] && 
        cocktailPrice <= filters.priceRange[1];
    });
    
    setCocktails(filteredCocktails);
    
    toast({
      title: "Filters Applied",
      description: `Found ${filteredCocktails.length} cocktails matching your criteria.`
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCocktails(allCocktails);
    setFilters({
      priceRange: [0, 25],
      distance: 10
    });
  };

  return {
    cocktails,
    allCocktails,
    establishments,
    searchQuery,
    filters,
    activeTab,
    setActiveTab,
    userLocation,
    isLoadingLocation,
    refreshLocation,
    handleSearch,
    handleFilterChange,
    applyFilters,
    resetFilters
  };
};

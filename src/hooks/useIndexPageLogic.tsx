
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserLocation } from '@/hooks/useUserLocation';
import Fuse from 'fuse.js';
import { performAdvancedSearch, createFuzzySearch, SearchableItem } from '@/utils/searchUtils';

// Import sample data
import { sampleCocktails, sampleEstablishments } from '@/data/sampleData';

interface Filters {
  priceRange: [number, number];
  distance: number;
}

// Define the cocktail interface to match the expected structure
interface Cocktail {
  id: string;
  name: string;
  price: string | number;
  description: string;
  ingredients: string[];
  image?: string;
  establishment: {
    name: string;
    distance?: string;
  };
}

export const useIndexPageLogic = () => {
  const [cocktails, setCocktails] = useState<Cocktail[]>(sampleCocktails);
  const [allCocktails, setAllCocktails] = useState<Cocktail[]>(sampleCocktails);
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

  // Create fuzzy search instance for cocktails with better settings for auto-suggestion
  const fuseInstance = useMemo(() => 
    createFuzzySearch(allCocktails as SearchableItem[], {
      // Lower threshold for better fuzzy matching sensitivity
      threshold: 0.3,
      // Include score to better rank results
      includeScore: true,
      // Ignore location for better partial matches
      ignoreLocation: true,
      // Search these fields
      keys: [
        { name: 'name', weight: 2 }, // Give name higher priority
        'description',
        'ingredients',
        'establishment.name'
      ]
    }),
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

  // Memoize the search handler to avoid unnecessary rerenders
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    // Perform advanced search only if there is a query
    if (query) {
      // Cast search results back to Cocktail[] to match the expected type
      const searchResults = performAdvancedSearch(
        allCocktails as SearchableItem[], 
        query, 
        fuseInstance
      ) as Cocktail[];
      
      setCocktails(searchResults);
      
      // Show toast for search results
      if (searchResults.length === 0) {
        toast({
          title: "No results found",
          description: `Try a different search term or reset filters.`
        });
      }
    } else {
      // If no search query, show all cocktails
      setCocktails(allCocktails);
    }
  }, [allCocktails, fuseInstance, toast]);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  const applyFilters = useCallback(() => {
    // Start with all cocktails or current search results
    let filteredCocktails = searchQuery ? 
      performAdvancedSearch(
        allCocktails as SearchableItem[], 
        searchQuery, 
        fuseInstance
      ) as Cocktail[] : 
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
  }, [allCocktails, filters, fuseInstance, searchQuery, toast]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setCocktails(allCocktails);
    setFilters({
      priceRange: [0, 25],
      distance: 10
    });
  }, [allCocktails]);

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

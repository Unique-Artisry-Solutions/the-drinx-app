
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserLocation } from '@/hooks/useUserLocation';
import { performAdvancedSearch, createFuzzySearch, SearchableItem } from '@/utils/searchUtils';
import { sampleCocktails, sampleEstablishments } from '@/data/sampleData';

interface Filters {
  priceRange: [number, number];
  distance: number;
}

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
  const [allCocktails] = useState<Cocktail[]>(sampleCocktails);
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 25],
    distance: 10
  });
  const [activeTab, setActiveTab] = useState("featured");
  const { toast } = useToast();
  const { userLocation, isLoading: isLoadingLocation, refreshLocation, calculateDistance, formatDistance } = useUserLocation();

  const fuseInstance = useMemo(() => createFuzzySearch(allCocktails as SearchableItem[]), [allCocktails]);

  useEffect(() => {
    if (userLocation && establishments.length > 0) {
      const updatedEstablishments = establishments.map(est => ({
        ...est,
        distance: formatDistance(calculateDistance(est.latitude, est.longitude))
      }));
      setEstablishments(updatedEstablishments);
    }
  }, [userLocation, establishments, calculateDistance, formatDistance]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (query) {
      const searchResults = performAdvancedSearch(allCocktails as SearchableItem[], query, fuseInstance) as Cocktail[];
      setCocktails(searchResults);
      
      if (searchResults.length === 0) {
        toast({ title: "No results found", description: "Try a different search term." });
      }
    } else {
      setCocktails(allCocktails);
    }
  }, [allCocktails, fuseInstance, toast]);
  
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };
  
  const applyFilters = useCallback(() => {
    let filteredCocktails = searchQuery ? 
      performAdvancedSearch(allCocktails as SearchableItem[], searchQuery, fuseInstance) as Cocktail[] : 
      [...allCocktails];
    
    // Apply price filter
    filteredCocktails = filteredCocktails.filter(cocktail => {
      const price = typeof cocktail.price === 'string' ? parseFloat(cocktail.price) : cocktail.price;
      return !isNaN(price) && price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    setCocktails(filteredCocktails);
    toast({ title: "Filters Applied", description: `Found ${filteredCocktails.length} cocktails.` });
  }, [allCocktails, filters, fuseInstance, searchQuery, toast]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setCocktails(allCocktails);
    setFilters({ priceRange: [0, 25], distance: 10 });
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


import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserLocation } from '@/hooks/useUserLocation';

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

    // Filter cocktails based on search query
    if (query) {
      const filtered = allCocktails.filter(cocktail => 
        cocktail.name.toLowerCase().includes(query.toLowerCase()) || 
        cocktail.description.toLowerCase().includes(query.toLowerCase()) || 
        cocktail.ingredients.some(i => i.toLowerCase().includes(query.toLowerCase()))
      );
      setCocktails(filtered);
    } else {
      setCocktails(allCocktails);
    }
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  const applyFilters = () => {
    // Apply price range filter
    const filtered = allCocktails.filter(cocktail => {
      const cocktailPrice = typeof cocktail.price === 'string' 
        ? parseFloat(cocktail.price) 
        : cocktail.price;
      
      return !isNaN(cocktailPrice) && 
        cocktailPrice >= filters.priceRange[0] && 
        cocktailPrice <= filters.priceRange[1];
    });
    
    setCocktails(filtered);
    
    toast({
      title: "Filters Applied",
      description: `Found ${filtered.length} cocktails matching your criteria.`
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

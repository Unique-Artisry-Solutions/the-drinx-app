
import { useState, useEffect, useMemo } from 'react';
import { Establishment, Cocktail } from '@/types/ProfileTypes';

export const useExploreData = (
  establishments: Establishment[],
  cocktails: Cocktail[],
  searchTerm: string,
  filters: any
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredEstablishments = useMemo(() => {
    if (!searchTerm) return establishments;
    return establishments.filter(est => 
      est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [establishments, searchTerm]);

  const filteredCocktails = useMemo(() => {
    if (!searchTerm) return cocktails;
    return cocktails.filter(cocktail => 
      cocktail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cocktail.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [cocktails, searchTerm]);

  const searchEstablishments = (term: string) => {
    console.log('Searching establishments for:', term);
  };

  const searchCocktails = (term: string) => {
    console.log('Searching cocktails for:', term);
  };

  return {
    filteredEstablishments,
    filteredCocktails,
    isLoading,
    error,
    searchEstablishments,
    searchCocktails
  };
};

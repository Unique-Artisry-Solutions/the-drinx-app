
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';

type Cocktail = {
  id: string;
  name: string;
  price: string;
  description: string;
  ingredients?: string[];
  image?: string;
  establishment: {
    id: string;
    name: string;
    distance?: string;
  } | undefined;
};

type FetchCocktailsOptions = {
  searchTerm?: string;
  maxResults?: number;
}

const fetchCocktailsFromSupabase = async ({ 
  searchTerm,
  maxResults = 20
}: FetchCocktailsOptions): Promise<Cocktail[]> => {
  let query = supabaseClient
    .from('cocktails')
    .select(`
      *,
      establishments:establishment_id (
        id,
        name
      )
    `);
  
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }
  
  query = query.limit(maxResults);
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching cocktails:', error);
    throw new Error(error.message);
  }
  
  return data?.map(cocktail => ({
    id: cocktail.id,
    name: cocktail.name,
    price: cocktail.price || '$0.00',
    description: cocktail.description || '',
    ingredients: cocktail.ingredients || [],
    image: cocktail.image_url,
    establishment: cocktail.establishments ? {
      id: cocktail.establishments.id,
      name: cocktail.establishments.name
    } : undefined
  })) || [];
};

export const useCocktails = (options: FetchCocktailsOptions = {}) => {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(options.searchTerm || '');
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['cocktails', options],
    queryFn: () => fetchCocktailsFromSupabase({
      ...options,
      searchTerm: searchTerm || options.searchTerm
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    if (data) {
      setCocktails(data);
    }
  }, [data]);
  
  const filterCocktails = (term: string) => {
    setSearchTerm(term);
    refetch();
  };
  
  return {
    cocktails,
    isLoading,
    error,
    refetch,
    searchTerm,
    filterCocktails
  };
};


import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Establishment } from '@/lib/supabase';
import { calculateDistance } from '@/lib/utils';

type FetchEstablishmentsOptions = {
  latitude?: number;
  longitude?: number;
  searchTerm?: string;
}

const fetchEstablishmentsFromSupabase = async ({ 
  latitude, 
  longitude, 
  searchTerm 
}: FetchEstablishmentsOptions): Promise<Establishment[]> => {
  let query = supabase
    .from('establishments')
    .select('*');
  
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching establishments:', error);
    throw new Error(error.message);
  }
  
  // If we have user location, calculate distances
  if (latitude && longitude && data) {
    return data.map(establishment => {
      const distance = calculateDistance(
        latitude,
        longitude,
        establishment.latitude,
        establishment.longitude
      );
      
      // Map database fields to our app's format
      return {
        ...establishment,
        cocktailCount: establishment.cocktail_count,
        image: establishment.image_url,
        distance: `${distance.toFixed(1)} mi`
      } as Establishment;
    });
  }
  
  // Return data without distances if no location
  return data?.map(establishment => ({
    ...establishment,
    cocktailCount: establishment.cocktail_count,
    image: establishment.image_url,
  })) as Establishment[] || [];
};

export const useEstablishments = (options: FetchEstablishmentsOptions = {}) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(options.searchTerm || '');
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['establishments', options],
    queryFn: () => fetchEstablishmentsFromSupabase({
      ...options,
      searchTerm: searchTerm || options.searchTerm
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    if (data) {
      setEstablishments(data);
      setFilteredEstablishments(data);
    }
  }, [data]);
  
  const filterEstablishments = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredEstablishments(establishments);
      return;
    }
    
    const filtered = establishments.filter(place =>
      place.name.toLowerCase().includes(term.toLowerCase()) ||
      place.address.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredEstablishments(filtered);
  };
  
  const performSearch = () => {
    refetch();
  };
  
  return {
    establishments: filteredEstablishments,
    isLoading,
    error,
    refetch,
    searchTerm,
    filterEstablishments,
    performSearch
  };
};

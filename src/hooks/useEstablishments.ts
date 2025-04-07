
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { calculateDistance } from '@/lib/utils';
import { Establishment } from '@/types/DatabaseTypes';

type FetchEstablishmentsOptions = {
  latitude?: number;
  longitude?: number;
  searchTerm?: string;
  maxDistance?: number;
}

const fetchEstablishmentsFromSupabase = async ({ 
  latitude, 
  longitude, 
  searchTerm,
  maxDistance = 20
}: FetchEstablishmentsOptions): Promise<Establishment[]> => {
  let query = supabaseClient
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
  
  // If we have user location, calculate distances and filter by max distance
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
        distance: `${distance.toFixed(1)} mi`,
        distanceValue: distance, // Add raw distance for filtering
        created_at: establishment.created_at
      } as Establishment;
    }).filter(est => est.distanceValue <= maxDistance); // Filter by distance
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
  const [maxDistance, setMaxDistance] = useState<number>(options.maxDistance || 20);
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['establishments', options, maxDistance],
    queryFn: () => fetchEstablishmentsFromSupabase({
      ...options,
      searchTerm: searchTerm || options.searchTerm,
      maxDistance
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
  
  const updateMaxDistance = (distance: number) => {
    setMaxDistance(distance);
    refetch();
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
    performSearch,
    maxDistance,
    updateMaxDistance
  };
};

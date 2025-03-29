
import { useState, useEffect } from 'react';
import { supabase, Establishment } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useUserLocation } from '@/hooks/useUserLocation';
import { sampleEstablishments } from '@/data/sampleData'; // For fallback

export const useEstablishments = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { userLocation, calculateDistance, formatDistance } = useUserLocation();

  // Fetch establishments from Supabase
  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('establishments')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          // Transform data to match our application's structure
          const transformedData = data.map((est: any) => ({
            id: est.id,
            name: est.name,
            address: est.address,
            latitude: est.latitude,
            longitude: est.longitude,
            cocktailCount: est.cocktail_count,
            image: est.image_url,
            phone: est.phone,
            website: est.website,
            hours: est.hours,
            distance: userLocation 
              ? formatDistance(calculateDistance(est.latitude, est.longitude)) 
              : 'Unknown'
          }));

          setEstablishments(transformedData);
          setFilteredEstablishments(transformedData);
        } else {
          // Fallback to sample data if no data is returned
          console.warn('No establishments found in Supabase, using sample data.');
          const sampleData = sampleEstablishments.map(est => ({
            ...est,
            distance: userLocation 
              ? formatDistance(calculateDistance(est.latitude, est.longitude)) 
              : 'Unknown'
          }));
          setEstablishments(sampleData);
          setFilteredEstablishments(sampleData);
        }
      } catch (err: any) {
        console.error('Error fetching establishments:', err);
        setError(err.message || 'Failed to fetch establishments');
        toast({
          title: 'Error fetching establishments',
          description: 'Using sample data instead.',
          variant: 'destructive',
        });
        
        // Fallback to sample data
        const sampleData = sampleEstablishments.map(est => ({
          ...est,
          distance: userLocation 
            ? formatDistance(calculateDistance(est.latitude, est.longitude)) 
            : 'Unknown'
        }));
        setEstablishments(sampleData);
        setFilteredEstablishments(sampleData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstablishments();
  }, [userLocation, calculateDistance, formatDistance, toast]);

  // Search function
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredEstablishments(establishments);
      return;
    }

    const filtered = establishments.filter(est => 
      est.name.toLowerCase().includes(query.toLowerCase()) || 
      est.address.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredEstablishments(filtered);
    
    toast({
      title: `${filtered.length} establishments found`,
      description: filtered.length > 0 
        ? "Results updated based on your search." 
        : "Try a different search term."
    });
  };

  return {
    establishments,
    filteredEstablishments,
    isLoading,
    error,
    handleSearch,
    setFilteredEstablishments
  };
};

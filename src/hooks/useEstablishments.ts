
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance } from '@/utils/locationUtils';

export interface Establishment {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: string;
  distanceValue?: number;
  cocktailCount: number;
  image?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseEstablishmentsProps {
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
}

export const useEstablishments = ({ latitude, longitude, maxDistance = 10 }: UseEstablishmentsProps = {}) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('establishments')
          .select('*')
          .order('name');

        if (fetchError) {
          throw fetchError;
        }

        let processedEstablishments = data?.map(est => ({
          id: est.id,
          name: est.name,
          address: est.address,
          latitude: est.latitude || 0,
          longitude: est.longitude || 0,
          cocktailCount: est.cocktail_count || 0,
          image: est.image_url,
          owner_id: est.owner_id,
          created_at: est.created_at,
          updated_at: est.updated_at
        })) || [];

        // If user location is provided, calculate distances and filter
        if (latitude && longitude) {
          processedEstablishments = processedEstablishments.map(est => {
            const distance = calculateDistance(latitude, longitude, est.latitude, est.longitude);
            return {
              ...est,
              distance: `${distance.toFixed(1)} mi`,
              distanceValue: distance
            };
          }).filter(est => est.distanceValue! <= maxDistance)
            .sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0));
        }

        setEstablishments(processedEstablishments);
      } catch (err) {
        console.error('Error fetching establishments:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch establishments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstablishments();
  }, [latitude, longitude, maxDistance]);

  return {
    establishments,
    isLoading,
    error
  };
};

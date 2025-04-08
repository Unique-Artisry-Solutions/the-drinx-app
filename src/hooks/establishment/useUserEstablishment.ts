
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

/**
 * Hook to get the establishment ID associated with the current user
 */
export function useUserEstablishment() {
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEstablishmentId = async () => {
      if (!user) {
        setIsLoading(false);
        setError("User not authenticated");
        return;
      }

      try {
        // Fetch the establishment owned by the current user
        const { data, error } = await supabase
          .from('establishments')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setEstablishmentId(data.id);
        } else {
          // For demo purposes, use a default ID if no establishment is found
          const { data: anyEstablishment, error: fetchError } = await supabase
            .from('establishments')
            .select('id')
            .limit(1)
            .maybeSingle();

          if (fetchError) throw fetchError;

          if (anyEstablishment) {
            console.log("Using sample establishment ID for demo:", anyEstablishment.id);
            setEstablishmentId(anyEstablishment.id);
          } else {
            setError("No establishments found");
          }
        }
      } catch (err: any) {
        console.error("Error fetching establishment:", err);
        setError(err.message || "Failed to fetch establishment");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstablishmentId();
  }, [user]);

  return {
    establishmentId,
    isLoading,
    error
  };
}

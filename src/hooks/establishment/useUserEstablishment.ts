
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to get the establishment ID associated with the current user
 */
export function useUserEstablishment() {
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

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
          console.log("Found user's establishment:", data.id);
          setEstablishmentId(data.id);
        } else {
          console.log("No establishment found for user, looking for a sample establishment");
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
            
            // Show a toast to inform the user we're using demo data
            toast({
              title: "Using demo establishment",
              description: "No establishment found for your account. Using sample data instead.",
              variant: "default"
            });
          } else {
            setError("No establishments found in the database");
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
  }, [user, toast]);

  return {
    establishmentId,
    isLoading,
    error
  };
}

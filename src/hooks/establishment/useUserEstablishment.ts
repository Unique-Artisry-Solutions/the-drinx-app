
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { useImpersonationState } from '@/hooks/useImpersonationState';

/**
 * Hook to get the establishment ID associated with the current user
 */
export function useUserEstablishment() {
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isImpersonating, currentUser } = useImpersonationState();
  
  // Use impersonated user if impersonating, otherwise use auth user
  const effectiveUser = isImpersonating ? currentUser : user;

  useEffect(() => {
    const fetchEstablishmentId = async () => {
      if (!effectiveUser) {
        setIsLoading(false);
        setError("User not authenticated");
        return;
      }

      try {
        // Check if we're using admin bypass
        const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
        const userType = localStorage.getItem('user_type');
        
        if (isAdminBypass && userType === 'establishment') {
          // For establishment admin bypass, fetch any establishment for demo purposes
          const { data: anyEstablishment, error: fetchError } = await supabase
            .from('establishments')
            .select('id')
            .limit(1)
            .maybeSingle();

          if (fetchError) throw fetchError;

          if (anyEstablishment) {
            console.log("Using sample establishment ID for admin bypass:", anyEstablishment.id);
            setEstablishmentId(anyEstablishment.id);
            
            toast({
              title: "Using demo establishment",
              description: "Using sample establishment data for admin bypass mode.",
              variant: "default"
            });
            setIsLoading(false);
            return;
          }
        }

        // Regular flow - fetch the establishment owned by the effective user (could be impersonated)
        const { data, error } = await supabase
          .from('establishments')
          .select('id')
          .eq('owner_id', effectiveUser.id)
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
  }, [effectiveUser, toast, isImpersonating]);

  return {
    establishmentId,
    isLoading,
    error
  };
}

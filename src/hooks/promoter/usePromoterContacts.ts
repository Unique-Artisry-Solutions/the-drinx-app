
import { useState, useEffect, useCallback, useRef } from 'react';
import { VenueContact } from './types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useRetry } from '@/hooks/useRetry';

export const usePromoterContacts = () => {
  const [contacts, setContacts] = useState<VenueContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const { user } = useAuth();
  const fetchAbortController = useRef<AbortController | null>(null);
  const { executeWithRetry, isRetrying, attempts } = useRetry({
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    onRetry: (attempt, error) => {
      console.log(`🔄 Retrying contact fetch (attempt ${attempt}):`, error.message);
    },
    onFailure: (error) => {
      console.error('❌ All contact fetch attempts failed:', error);
      setError('Failed to load venue contacts after multiple attempts');
    }
  });

  // Cache contacts for better UX
  const [cachedContacts, setCachedContacts] = useState<VenueContact[]>([]);

  const fetchContacts = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setContacts([]);
      setIsLoading(false);
      return;
    }

    // Prevent rapid successive calls
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime < 2000) {
      console.log('⏱️ Skipping fetch - too soon since last call');
      return;
    }

    // Abort any existing fetch
    if (fetchAbortController.current) {
      fetchAbortController.current.abort();
    }
    fetchAbortController.current = new AbortController();

    // Use cached data immediately if available and not forcing refresh
    if (!forceRefresh && cachedContacts.length > 0) {
      setContacts(cachedContacts);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    setLastFetchTime(now);

    try {
      const result = await executeWithRetry(async () => {
        // Get only establishments that have owners (real users)
        const { data: establishments, error: establishmentsError } = await supabase
          .from('establishments')
          .select('id, name, owner_id')
          .not('owner_id', 'is', null)
          .order('name')
          .abortSignal(fetchAbortController.current?.signal);
          
        if (establishmentsError) throw establishmentsError;
        
        // Get venue owner profiles
        const ownerIds = establishments
          .map(e => e.owner_id)
          .filter(Boolean) as string[];
        
        let ownerProfiles: Record<string, { name: string, role: string }> = {};
        
        if (ownerIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, display_name, username')
            .in('id', ownerIds)
            .abortSignal(fetchAbortController.current?.signal);
            
          if (profilesError) throw profilesError;
          
          ownerProfiles = (profiles || []).reduce((acc, profile) => {
            acc[profile.id] = {
              name: profile.display_name || profile.username || 'Unknown',
              role: 'Venue Manager'
            };
            return acc;
          }, {} as Record<string, { name: string, role: string }>);
        }
        
        // Transform to contacts format
        const venueContacts: VenueContact[] = establishments.map((establishment, index) => {
          const ownerId = establishment.owner_id;
          const ownerInfo = ownerId ? ownerProfiles[ownerId] : null;
          
          return {
            id: `contact-${index}-${establishment.id}`,
            name: ownerInfo?.name || 'Venue Manager',
            role: ownerInfo?.role || 'Manager',
            venueId: establishment.id,
            venueName: establishment.name
          };
        });

        return venueContacts;
      });

      // Update both current and cached contacts
      setContacts(result);
      setCachedContacts(result);
      
    } catch (err: any) {
      // Handle aborted requests gracefully
      if (err.name === 'AbortError') {
        console.log('🛑 Contact fetch was aborted');
        return;
      }
      
      console.error('Error fetching promoter contacts:', err);
      
      // Use cached contacts if available on error
      if (cachedContacts.length > 0 && !forceRefresh) {
        console.log('📱 Using cached contacts due to error');
        setContacts(cachedContacts);
      } else {
        setError(err.message || 'Failed to load venue contacts');
      }
    } finally {
      setIsLoading(false);
      fetchAbortController.current = null;
    }
  }, [user, executeWithRetry, lastFetchTime, cachedContacts]);

  useEffect(() => {
    fetchContacts();
    
    // Cleanup on unmount
    return () => {
      if (fetchAbortController.current) {
        fetchAbortController.current.abort();
      }
    };
  }, [fetchContacts]);

  return {
    contacts,
    isLoading: isLoading || isRetrying,
    error,
    refetch: (forceRefresh?: boolean) => fetchContacts(forceRefresh || true),
    attempts,
    hasCache: cachedContacts.length > 0
  };
};

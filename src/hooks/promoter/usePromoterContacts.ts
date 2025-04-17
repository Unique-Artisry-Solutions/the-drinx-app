
import { useState, useEffect, useCallback } from 'react';
import { VenueContact } from './types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

export const usePromoterContacts = () => {
  const [contacts, setContacts] = useState<VenueContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchContacts = useCallback(async () => {
    if (!user) {
      setContacts([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get establishments
      const { data: establishments, error: establishmentsError } = await supabase
        .from('establishments')
        .select('id, name, owner_id')
        .order('name');
        
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
          .in('id', ownerIds);
          
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
      
      setContacts(venueContacts);
    } catch (err) {
      console.error('Error fetching promoter contacts:', err);
      setError('Failed to load venue contacts');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    isLoading,
    error,
    refetch: fetchContacts
  };
};

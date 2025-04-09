
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

export function useEstablishmentDetails(urlEstablishmentId?: string) {
  const { user } = useAuth();
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [establishmentName, setEstablishmentName] = useState<string>('');

  useEffect(() => {
    const fetchEstablishment = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (urlEstablishmentId) {
          const { data, error } = await supabase
            .from('establishments')
            .select('id, name')
            .eq('id', urlEstablishmentId)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setEstablishmentId(data.id);
            setEstablishmentName(data.name);
          } else {
            // If no establishment found with provided ID, try to get the user's establishment
            if (user) {
              const { data: userEstablishment, error: userEstablishmentError } = await supabase
                .from('establishments')
                .select('id, name')
                .eq('owner_id', user.id)
                .maybeSingle();
                
              if (userEstablishmentError) throw userEstablishmentError;
              
              if (userEstablishment) {
                setEstablishmentId(userEstablishment.id);
                setEstablishmentName(userEstablishment.name);
              } else {
                throw new Error('No establishment found for this user');
              }
            } else {
              throw new Error('Establishment not found');
            }
          }
        } 
        else if (user) {
          const { data, error } = await supabase
            .from('establishments')
            .select('id, name')
            .eq('owner_id', user.id)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setEstablishmentId(data.id);
            setEstablishmentName(data.name);
          } else {
            // Fallback to sample data for development/testing purposes
            console.log('No establishment found, using sample data for development');
            setEstablishmentId('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'); // Sample UUID
            setEstablishmentName('Sample Establishment');
          }
        } else {
          throw new Error('No establishment specified');
        }
      } catch (err: any) {
        console.error('Error fetching establishment:', err);
        setError(err.message || 'Failed to load establishment');
        
        // Fallback to sample data in error case for development purposes
        if (process.env.NODE_ENV !== 'production') {
          console.log('Using sample establishment data due to error');
          setEstablishmentId('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'); // Sample UUID
          setEstablishmentName('Sample Establishment (Error Fallback)');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEstablishment();
  }, [urlEstablishmentId, user]);

  return {
    establishmentId,
    establishmentName,
    isLoading,
    error
  };
}

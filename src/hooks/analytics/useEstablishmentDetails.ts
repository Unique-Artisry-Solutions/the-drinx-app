
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
            throw new Error('Establishment not found');
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
            throw new Error('No establishment found for this user');
          }
        } else {
          throw new Error('No establishment specified');
        }
      } catch (err: any) {
        console.error('Error fetching establishment:', err);
        setError(err.message || 'Failed to load establishment');
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

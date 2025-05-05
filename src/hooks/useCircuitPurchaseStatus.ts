
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';

export function useCircuitPurchaseStatus(circuitId: string) {
  const { user } = useAuth();
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!user || !circuitId) {
      setIsLoading(false);
      return;
    }
    
    const checkPurchaseStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check if the user has purchased a ticket for this circuit
        const { data, error } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('swig_circuit_id', circuitId)
          .eq('status', 'completed')
          .limit(1);
          
        if (error) {
          console.error('Error checking purchase status:', error);
          return;
        }
        
        setHasPurchased(data && data.length > 0);
      } catch (err) {
        console.error('Error in purchase check:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPurchaseStatus();
  }, [user, circuitId]);
  
  return { hasPurchased, isLoading };
}

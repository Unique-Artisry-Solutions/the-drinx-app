
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export const usePromoterRole = () => {
  const [isActivating, setIsActivating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const ensurePromoterRole = useCallback(async () => {
    if (!user) {
      throw new Error("Authentication required");
    }

    try {
      setIsActivating(true);

      // Use the RPC function to switch to promoter role with retries
      let retries = 2;
      let success = false;
      
      while (retries > 0 && !success) {
        try {
          const { error: switchError } = await supabase.rpc('switch_active_role', {
            role_to_activate: 'promoter'
          });
          
          if (switchError) throw switchError;
          success = true;
        } catch (error: any) {
          retries--;
          if (retries === 0) throw error;
          // Short delay between retries
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // Update local storage
      localStorage.setItem('user_type', 'promoter');

      // Show success message
      toast({
        title: "Role Activated",
        description: "Your promoter role has been activated successfully.",
      });

      return true;
    } catch (error: any) {
      console.error('Error activating promoter role:', error);
      toast({
        title: "Role Activation Failed",
        description: error.message || "Unable to activate promoter role. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsActivating(false);
    }
  }, [user, toast]);

  return {
    ensurePromoterRole,
    isActivating
  };
};

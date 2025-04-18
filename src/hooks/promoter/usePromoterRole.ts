
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
      
      // First check if user has the promoter role at all
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('is_active')
        .eq('user_id', user.id)
        .eq('role', 'promoter')
        .single();

      if (roleError) {
        // If error is not found, create the role
        if (roleError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: user.id,
              role: 'promoter',
              is_active: false
            });

          if (insertError) throw insertError;
        } else {
          throw roleError;
        }
      }

      // Now activate the promoter role
      const { error: switchError } = await supabase.rpc('switch_active_role', {
        role_to_activate: 'promoter'
      });

      if (switchError) throw switchError;

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

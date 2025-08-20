
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
      console.log('Starting promoter role activation process for user:', user.id);

      // First, check if promoter role exists and is already active
      const { data: activeRole, error: activeRoleError } = await supabase
        .from('user_roles')
        .select('is_active')
        .eq('user_id', user.id)
        .eq('role', 'promoter')
        .eq('is_active', true)
        .maybeSingle();

      if (activeRole) {
        console.log('Promoter role is already active');
        return true;
      }

      if (activeRoleError) {
        console.error('Error checking active role:', activeRoleError);
        throw new Error("Unable to verify promoter status");
      }

      // If no active role exists, try to activate it
      console.log('Activating promoter role');
      const { error: switchError } = await supabase.rpc('switch_active_role', {
        role_to_activate: 'promoter'
      });
      
      if (switchError) {
        console.error('Error switching to promoter role:', switchError);
        throw switchError;
      }

      // Add a small delay to allow role changes to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify the role was properly activated
      console.log('Verifying role activation');
      const { data: verifyData, error: verifyError } = await supabase
        .from('user_roles')
        .select('is_active')
        .eq('user_id', user.id)
        .eq('role', 'promoter')
        .maybeSingle();
        
      if (verifyError || !verifyData || !verifyData.is_active) {
        console.error('Role activation verification failed:', verifyError || 'Role not active');
        throw new Error("Failed to activate promoter role. Please try again.");
      }

      // Update local storage
      localStorage.setItem('user_type', 'promoter');
      console.log('Promoter role activated successfully');

      return true;
    } catch (error: any) {
      console.error('Error in promoter role activation:', error);
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


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

      // First, check if user has the promoter role at all
      console.log('Checking for promoter role for user:', user.id);
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('is_active')
        .eq('user_id', user.id)
        .eq('role', 'promoter')
        .single();
        
      if (roleError && !roleError.message.includes('No rows found')) {
        console.error('Error checking promoter role:', roleError);
        throw new Error("Unable to verify promoter status: " + roleError.message);
      }

      // If no promoter role exists, create it first
      if (!roleData) {
        console.log('No promoter role found, creating one');
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'promoter',
            is_active: false
          });

        if (insertError) {
          console.error('Error creating promoter role:', insertError);
          throw new Error("Unable to create promoter role: " + insertError.message);
        }
      }

      // Now try to activate the promoter role
      console.log('Activating promoter role');
      const { error: switchError } = await supabase.rpc('switch_active_role', {
        role_to_activate: 'promoter'
      });
      
      if (switchError) {
        console.error('Error switching to promoter role:', switchError);
        throw switchError;
      }

      // Verify the role was properly activated
      console.log('Verifying role activation');
      const { data: verifyData, error: verifyError } = await supabase
        .from('user_roles')
        .select('is_active')
        .eq('user_id', user.id)
        .eq('role', 'promoter')
        .single();
        
      if (verifyError || !verifyData || !verifyData.is_active) {
        console.error('Role activation verification failed:', verifyError || 'Role not active');
        throw new Error("Failed to activate promoter role. Please try again.");
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

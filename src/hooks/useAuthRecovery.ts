
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SessionStorageManager } from '@/utils/sessionStorage';

export const useAuthRecovery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;

      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions.",
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updatePassword = useCallback(async (newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const clearRecoveryData = useCallback(() => {
    // Clear any recovery-related session data
    SessionStorageManager.removeItem('password_recovery');
  }, []);

  return {
    isLoading,
    requestPasswordReset,
    updatePassword,
    clearRecoveryData,
  };
};

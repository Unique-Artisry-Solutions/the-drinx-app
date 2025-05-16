
import { supabase } from '@/lib/supabase';
import { ToastActionElement } from '@/components/ui/toast';

interface UseSessionRefreshProps {
  setIsEmailVerified: (isVerified: boolean) => void;
  setAuthError: (error: Error | null) => void;
  toast: {
    toast: (props: { 
      title?: string; 
      description?: string; 
      action?: ToastActionElement;
      variant?: 'default' | 'destructive';
    }) => void;
  };
}

export const useSessionRefresh = ({
  setIsEmailVerified,
  setAuthError,
  toast
}: UseSessionRefreshProps) => {
  // Function to refresh the current session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        setAuthError(error);
        throw error;
      }
      
      // Update email verification status if we have a session
      const isEmailVerified = !!data?.session?.user?.email_confirmed_at;
      setIsEmailVerified(isEmailVerified);
      
      return { isEmailVerified };
    } catch (error) {
      console.error('Session refresh error:', error);
      if (error instanceof Error) {
        setAuthError(error);
      } else {
        setAuthError(new Error('Unknown error refreshing session'));
      }
      
      toast.toast({
        title: "Session Error",
        description: "There was an error refreshing your session.",
        variant: "destructive"
      });
      
      return { isEmailVerified: false };
    }
  };

  return { refreshSession };
};

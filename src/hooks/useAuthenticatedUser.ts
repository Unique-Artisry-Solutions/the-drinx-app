
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { checkAdminBypassStatus, createBypassUser } from '@/utils/adminBypass';

/**
 * Hook that provides authenticated user information
 * Works with both Supabase auth and admin bypass
 */
export function useAuthenticatedUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // First check for admin bypass
    const { isEnabled } = checkAdminBypassStatus();
    if (isEnabled) {
      console.log('Admin bypass active, using bypass user');
      const bypassUser = createBypassUser();
      setUser(bypassUser);
      setIsLoading(false);
      return;
    }
    
    // Set up auth state listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Auth event: ${event}`, !!session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Session ended",
            description: "Please sign in again to continue.",
            variant: "destructive"
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(error => {
      console.error('Error checking auth session:', error);
      setIsLoading(false);
      toast({
        title: "Authentication Error",
        description: "There was a problem checking your login status. Please try refreshing the page.",
        variant: "destructive"
      });
    });

    // Listen for admin bypass changes
    const handleBypassChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail;
      
      console.log('Admin bypass changed:', detail);
      
      if (detail.enabled) {
        const bypassUser = createBypassUser();
        setUser(bypassUser);
      } else {
        // Only clear user if we were in bypass mode
        // Let normal auth flow handle real users
        if (checkAdminBypassStatus().isEnabled) {
          setUser(null);
        }
      }
    };
    
    window.addEventListener('adminBypassChanged', handleBypassChange);
    window.addEventListener('authReset', () => setUser(null));

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('adminBypassChanged', handleBypassChange);
      window.removeEventListener('authReset', () => setUser(null));
    };
  }, [toast]);

  return { user, isLoading };
}

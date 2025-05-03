
import { useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useAuthenticatedUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Use a callback for session checking to avoid race conditions
  const checkSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error(`Error checking session:`, error);
      return null;
    }
  }, []);

  useEffect(() => {
    const setupId = Date.now().toString();
    console.log(`[AUTH USER HOOK ${setupId}] Initializing authenticated user hook`);
    
    let isMounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`[AUTH USER HOOK ${setupId}] Auth state changed: ${event}`);
        
        if (!isMounted) return;
        
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

    // THEN check for existing session
    checkSession()
      .then(session => {
        if (!isMounted) return;
        
        console.log(`[AUTH USER HOOK ${setupId}] Initial session check: ${!!session}`);
        setUser(session?.user ?? null);
        setIsLoading(false);
      })
      .catch(error => {
        if (!isMounted) return;
        
        console.error(`[AUTH USER HOOK ${setupId}] Error checking auth session:`, error);
        setIsLoading(false);
        toast({
          title: "Authentication Error",
          description: "There was a problem checking your login status. Please try refreshing the page.",
          variant: "destructive"
        });
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      console.log(`[AUTH USER HOOK ${setupId}] Cleanup`);
    };
  }, [toast, checkSession]);

  return { user, isLoading };
}

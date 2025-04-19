
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useAuthenticatedUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
    supabase.auth.getSession().then(({ data: { session } }) => {
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

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { user, isLoading };
}

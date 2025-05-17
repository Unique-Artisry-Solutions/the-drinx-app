
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';
import { AppSubscription } from '@/types/SubscriptionTypes';

export const useSubscriptions = () => {
  const supabaseClient = useSupabaseClient();
  const [subscriptions, setSubscriptions] = useState<AppSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const user = useUser();

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setSubscriptions([]);
        return;
      }
      
      const { data, error } = await supabaseClient
        .from('app_subscriptions')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setSubscriptions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching subscriptions'));
      toast({
        title: 'Error fetching subscriptions',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchSubscriptions
  };
};

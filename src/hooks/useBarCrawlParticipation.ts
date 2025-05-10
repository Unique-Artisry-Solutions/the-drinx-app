
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type ParticipationStatus = 'NOT_JOINED' | 'JOINED' | 'JOINING' | 'LEAVING';

interface UseBarCrawlParticipationProps {
  barCrawlId: string;
}

export const useBarCrawlParticipation = ({ barCrawlId }: UseBarCrawlParticipationProps) => {
  const [status, setStatus] = useState<ParticipationStatus>('NOT_JOINED');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if user is already participating in this bar crawl
    const checkParticipation = async () => {
      try {
        const { data: session } = await supabase.auth.getUser();
        if (!session.user) return;

        const { data, error } = await supabase
          .from('bar_crawl_participants')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('bar_crawl_id', barCrawlId)
          .maybeSingle();

        if (error) throw error;
        setStatus(data ? 'JOINED' : 'NOT_JOINED');
      } catch (err) {
        console.error('Error checking bar crawl participation:', err);
        setError(err as Error);
      }
    };

    checkParticipation();
  }, [barCrawlId]);

  const handleJoin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: session } = await supabase.auth.getUser();
      if (!session.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.from('bar_crawl_participants').insert({
        user_id: session.user.id,
        bar_crawl_id: barCrawlId,
        joined_at: new Date().toISOString(),
      });

      if (error) throw error;
      setStatus('JOINED');
    } catch (err) {
      console.error('Error joining bar crawl:', err);
      setError(err as Error);
      setStatus('NOT_JOINED');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: session } = await supabase.auth.getUser();
      if (!session.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('bar_crawl_participants')
        .delete()
        .eq('user_id', session.user.id)
        .eq('bar_crawl_id', barCrawlId);

      if (error) throw error;
      setStatus('NOT_JOINED');
    } catch (err) {
      console.error('Error leaving bar crawl:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    status,
    isLoading,
    error,
    handleJoin,
    handleLeave,
  };
};

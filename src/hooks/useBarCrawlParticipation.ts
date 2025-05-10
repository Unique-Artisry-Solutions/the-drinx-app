
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type ParticipationStatus = 'NOT_JOINED' | 'JOINED' | 'JOINING' | 'LEAVING';

interface UseBarCrawlParticipationProps {
  barCrawlId: string;
}

export const useBarCrawlParticipation = ({ barCrawlId }: UseBarCrawlParticipationProps) => {
  const [status, setStatus] = useState<ParticipationStatus>('NOT_JOINED');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Computed property based on status
  const isJoined = status === 'JOINED';

  useEffect(() => {
    // Check if user is already participating in this bar crawl
    const checkParticipation = async () => {
      setIsCheckingStatus(true);
      try {
        const { data: session } = await supabase.auth.getUser();
        if (!session.user) {
          setIsCheckingStatus(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('bar_crawl_participants')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('bar_crawl_id', barCrawlId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        setStatus(data ? 'JOINED' : 'NOT_JOINED');
      } catch (err: any) {
        console.error('Error checking bar crawl participation:', err);
        setError(err.message || 'Failed to check participation status');
      } finally {
        setIsCheckingStatus(false);
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
        throw new Error('Please sign in to join this circuit');
      }

      const { error: joinError } = await supabase.from('bar_crawl_participants').insert({
        user_id: session.user.id,
        bar_crawl_id: barCrawlId,
        joined_at: new Date().toISOString(),
      });

      if (joinError) throw joinError;
      setStatus('JOINED');
    } catch (err: any) {
      console.error('Error joining bar crawl:', err);
      setError(err.message || 'Failed to join');
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
        throw new Error('Please sign in to leave this circuit');
      }

      const { error: leaveError } = await supabase
        .from('bar_crawl_participants')
        .delete()
        .eq('user_id', session.user.id)
        .eq('bar_crawl_id', barCrawlId);

      if (leaveError) throw leaveError;
      setStatus('NOT_JOINED');
    } catch (err: any) {
      console.error('Error leaving bar crawl:', err);
      setError(err.message || 'Failed to leave');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    status,
    isLoading,
    isCheckingStatus,
    isJoined,
    error,
    handleJoin,
    handleLeave,
  };
};

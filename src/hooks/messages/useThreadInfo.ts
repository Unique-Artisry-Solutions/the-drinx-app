
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ThreadInfo } from './types';

export const useThreadInfo = (threadId: string | null) => {
  const [threadInfo, setThreadInfo] = useState<ThreadInfo>({
    venueName: '',
    promoterName: '',
    subject: '',
    venueId: '' // Initialize venueId
  });

  const fetchThreadInfo = useCallback(async () => {
    if (!threadId) return;
    
    try {
      const { data: threadData, error: threadError } = await supabase
        .from('promoter_venue_threads')
        .select(`
          id,
          subject,
          venue_id,
          promoter_id
        `)
        .eq('id', threadId)
        .single();

      if (threadError) throw threadError;

      const { data: venueData, error: venueError } = await supabase
        .from('establishments')
        .select('name')
        .eq('id', threadData.venue_id)
        .single();

      if (venueError && venueError.code !== 'PGRST116') {
        console.error('Error fetching venue info:', venueError);
      }

      const { data: promoterData, error: promoterError } = await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', threadData.promoter_id)
        .single();

      if (promoterError && promoterError.code !== 'PGRST116') {
        console.error('Error fetching promoter info:', promoterError);
      }

      setThreadInfo({
        venueName: venueData?.name || 'Unknown Venue',
        promoterName: promoterData?.display_name || promoterData?.username || 'Unknown Promoter',
        subject: threadData?.subject || '',
        venueId: threadData?.venue_id || '' // Set venueId from thread data
      });
    } catch (err: any) {
      console.error('Error fetching thread info:', err);
    }
  }, [threadId]);

  return {
    threadInfo,
    fetchThreadInfo
  };
};


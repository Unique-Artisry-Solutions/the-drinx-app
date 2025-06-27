
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ThreadInfo } from './types';

export const useThreadInfo = (threadId: string | null) => {
  const [threadInfo, setThreadInfo] = useState<ThreadInfo>({
    venueName: '',
    promoterName: '',
    subject: '',
    venueId: ''
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
          promoter_id,
          venues:establishments(id, name),
          promoters:profiles!promoter_id(id, display_name, username)
        `)
        .eq('id', threadId)
        .single();

      if (threadError) throw threadError;

      setThreadInfo({
        venueName: threadData.venues?.name || 'Unknown Venue',
        promoterName: threadData.promoters?.display_name || threadData.promoters?.username || 'Unknown Promoter',
        subject: threadData.subject || '',
        venueId: threadData.venue_id || ''
      });
    } catch (err: any) {
      console.error('Error fetching thread info:', err);
      // Set fallback values to prevent UI issues
      setThreadInfo({
        venueName: 'Unknown Venue',
        promoterName: 'Unknown Promoter',
        subject: '',
        venueId: ''
      });
    }
  }, [threadId]);

  return {
    threadInfo,
    fetchThreadInfo
  };
};

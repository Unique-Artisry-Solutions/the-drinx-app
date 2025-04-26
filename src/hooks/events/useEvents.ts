
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  venue_id: string | null;
  image_url?: string;
  created_at: string;
}

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Event[];
    },
  });
};


import { supabase } from '@/integrations/supabase/client';

export async function updateEventStatus(eventId: string, status: 'draft' | 'published' | 'cancelled' | 'completed'): Promise<void> {
  const { error } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId);
  
  if (error) throw error;
}


import { supabase } from '@/integrations/supabase/client';

/**
 * Update an event's status
 * @param eventId The ID of the event to update
 * @param status The new status to set
 */
export async function updateEventStatus(eventId: string, status: 'draft' | 'published' | 'cancelled' | 'completed'): Promise<void> {
  const { error } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId);
  
  if (error) throw error;
}

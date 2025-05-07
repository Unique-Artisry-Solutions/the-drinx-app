import { supabase } from '@/integrations/supabase/client';

export async function updateEventStatus(eventId: string, status: 'draft' | 'published' | 'cancelled' | 'completed'): Promise<void> {
  const { error } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId);
  
  if (error) throw error;
}

// Add this new function to get event details by ID
export async function getEventById(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting event by ID:', error);
    return null;
  }
}

// Export all services
export const eventService = {
  updateEventStatus,
  getEventById
};

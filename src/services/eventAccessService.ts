
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a new access token for an event
 */
export async function generateEventAccessToken(eventId: string, daysValid: number = 30): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .rpc('generate_event_access_token', {
        p_event_id: eventId,
        p_days_valid: daysValid
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating event access token:', error);
    throw error;
  }
}

/**
 * Verify if an event access token is valid
 */
export async function verifyEventAccessToken(eventId: string, token: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('verify_event_access_token', {
        p_event_id: eventId,
        p_token: token
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error verifying event access token:', error);
    return false;
  }
}

/**
 * Get the current active token for an event (if any)
 */
export async function getCurrentEventToken(eventId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('event_access_tokens')
      .select('token')
      .eq('event_id', eventId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      throw error;
    }

    return data?.token || null;
  } catch (error) {
    console.error('Error getting current event token:', error);
    return null;
  }
}

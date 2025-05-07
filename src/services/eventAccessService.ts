
import { supabase } from '@/lib/supabaseClient';

/**
 * Generate an access token for an event's check-in system
 * This token allows access to the event's scanner page
 */
export const generateEventAccessToken = async (eventId: string, daysValid = 30): Promise<string> => {
  try {
    // Call the Supabase function to generate a token
    const { data, error } = await supabase.rpc(
      'generate_event_access_token',
      {
        p_event_id: eventId,
        p_days_valid: daysValid
      }
    );

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error generating event access token:', error);
    throw new Error('Failed to generate access token');
  }
};

/**
 * Verify an access token for an event's check-in system
 */
export const verifyEventAccessToken = async (eventId: string, token: string): Promise<boolean> => {
  try {
    // Call the Supabase function to verify the token
    const { data, error } = await supabase.rpc(
      'verify_event_access_token',
      {
        p_event_id: eventId,
        p_token: token
      }
    );

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error verifying event access token:', error);
    return false;
  }
};

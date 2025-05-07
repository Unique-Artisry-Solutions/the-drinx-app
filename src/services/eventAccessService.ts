
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const generateEventAccessToken = async (eventId: string): Promise<string> => {
  // Generate a unique token for event access
  const token = uuidv4();
  
  // Calculate expiration date (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    
    // Store the token in database
    const { data, error } = await supabase
      .from('event_access_tokens')
      .insert({
        event_id: eventId,
        token: token,
        created_by: userData.user?.id,
        expires_at: expiresAt.toISOString(),
        is_active: true
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return token;
  } catch (error) {
    console.error('Error generating event access token:', error);
    throw new Error('Unable to generate access token');
  }
};

export const getCurrentEventToken = async (eventId: string): Promise<string | null> => {
  try {
    // Look up the most recent active token for this event
    const { data, error } = await supabase
      .from('event_access_tokens')
      .select('token')
      .eq('event_id', eventId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    return data.token;
  } catch (error) {
    console.error('Error fetching current event token:', error);
    return null;
  }
};

export const validateEventAccessToken = async (
  eventId: string, 
  token: string
): Promise<boolean> => {
  try {
    // Look up the token
    const { data, error } = await supabase
      .from('event_access_tokens')
      .select('*')
      .eq('event_id', eventId)
      .eq('token', token)
      .eq('is_active', true)
      .single();
      
    if (error || !data) {
      return false;
    }
    
    // Check if token is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      // Deactivate expired token
      await supabase
        .from('event_access_tokens')
        .update({ is_active: false })
        .eq('id', data.id);
        
      return false;
    }
    
    // Update last used timestamp
    await supabase
      .from('event_access_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);
      
    return true;
  } catch (error) {
    console.error('Error validating event access token:', error);
    return false;
  }
};

export const verifyEventAccessToken = async (eventId: string, token: string): Promise<boolean> => {
  return validateEventAccessToken(eventId, token);
};

export const revokeEventAccessToken = async (token: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('event_access_tokens')
      .update({ is_active: false })
      .eq('token', token);
      
    return !error;
  } catch (error) {
    console.error('Error revoking event access token:', error);
    return false;
  }
};

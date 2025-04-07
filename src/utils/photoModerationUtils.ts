
import { supabase } from '@/lib/supabase';

export interface ModerationPhoto {
  id: string;
  url: string;
  user_id: string;
  content_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  content_type: string;
  source_table: string;
  source_id: string;
  moderated_at?: string;
  moderated_by?: string;
  rejection_reason?: string;
}

/**
 * Submit a photo for moderation when it's uploaded
 */
export const submitPhotoForModeration = async (
  photoUrl: string, 
  userId: string, 
  sourceTable: string, 
  sourceId: string,
  contentType: string = 'image/jpeg'
) => {
  try {
    // Use type assertions to bypass the type checking
    const { data, error } = await (supabase
      .from('moderation_photos' as any)
      .insert({
        url: photoUrl,
        user_id: userId,
        content_status: 'pending',
        content_type: contentType,
        source_table: sourceTable,
        source_id: sourceId,
      } as any)
      .select()
      .single() as any);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting photo for moderation:', error);
    throw error;
  }
};

/**
 * Check if a photo has been approved
 */
export const isPhotoApproved = async (sourceTable: string, sourceId: string) => {
  try {
    // Use type assertions to bypass the type checking
    const { data, error } = await (supabase
      .from('moderation_photos' as any)
      .select('content_status')
      .eq('source_table', sourceTable)
      .eq('source_id', sourceId)
      .maybeSingle() as any);
    
    if (error) throw error;
    return data?.content_status === 'approved';
  } catch (error) {
    console.error('Error checking photo approval status:', error);
    return false;
  }
};

/**
 * Get moderation details for a photo
 */
export const getPhotoModerationDetails = async (sourceTable: string, sourceId: string) => {
  try {
    // Use type assertions to bypass the type checking
    const { data, error } = await (supabase
      .from('moderation_photos' as any)
      .select('*')
      .eq('source_table', sourceTable)
      .eq('source_id', sourceId)
      .maybeSingle() as any);
    
    if (error) throw error;
    return data as ModerationPhoto | null;
  } catch (error) {
    console.error('Error fetching photo moderation details:', error);
    return null;
  }
};

/**
 * Flag content for moderation review
 */
export const flagContent = async (
  contentType: string,
  contentId: string,
  reason: string,
  details?: string
) => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    const { data, error } = await (supabase
      .from('content_flags' as any)
      .insert({
        content_type: contentType,
        content_id: contentId,
        reporter_id: userId,
        reason: reason,
        details: details || null,
        status: 'pending'
      } as any)
      .select()
      .single() as any);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error flagging content:', error);
    throw error;
  }
};

/**
 * Get moderation notifications for the current user
 */
export const getModerationNotifications = async () => {
  try {
    const { data, error } = await (supabase
      .from('moderation_notifications' as any)
      .select('*')
      .eq('recipient_id', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false }) as any);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching moderation notifications:', error);
    return [];
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await (supabase
      .from('moderation_notifications' as any)
      .update({ is_read: true })
      .eq('id', notificationId) as any);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Get content flags for admin review
 */
export const getContentFlags = async (status: string = 'pending') => {
  try {
    const { data, error } = await (supabase
      .from('flagged_content_queue' as any)
      .select('*')
      .order('reported_at', { ascending: false }) as any);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching content flags:', error);
    return [];
  }
};


import { supabase } from '@/lib/supabase';

export interface ModerationPhoto {
  id: string;
  url: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
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
    const { data, error } = await supabase
      .from('moderation_photos')
      .insert({
        url: photoUrl,
        user_id: userId,
        status: 'pending',
        content_type: contentType,
        source_table: sourceTable,
        source_id: sourceId,
      } as any) // Using 'any' temporarily to bypass type checking
      .select()
      .single();
    
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
    const { data, error } = await supabase
      .from('moderation_photos')
      .select('status')
      .eq('source_table', sourceTable)
      .eq('source_id', sourceId)
      .maybeSingle();
    
    if (error) throw error;
    return data?.status === 'approved';
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
    const { data, error } = await supabase
      .from('moderation_photos')
      .select('*')
      .eq('source_table', sourceTable)
      .eq('source_id', sourceId)
      .maybeSingle();
    
    if (error) throw error;
    return data as unknown as ModerationPhoto | null;
  } catch (error) {
    console.error('Error fetching photo moderation details:', error);
    return null;
  }
};

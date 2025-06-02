
import { supabase } from '@/lib/supabase';

export const createProfileManually = async (user: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'Test User',
        username: user.user_metadata?.username || user.email.split('@')[0],
        user_type: user.user_metadata?.user_type || 'individual',
        phone: user.user_metadata?.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile manually:', error);
      throw error;
    }

    console.log('Profile created manually:', data);
    return data;
  } catch (error) {
    console.error('Failed to create profile manually:', error);
    throw error;
  }
};

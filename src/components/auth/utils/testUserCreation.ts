
import { supabase } from '@/lib/supabase';
import { TestUserCredentials } from '../types/testCredentials';

export const createTestEstablishment = async (ownerId: string, phone: string) => {
  try {
    const { error: establishmentError } = await supabase
      .from('establishments')
      .insert({
        name: "Test Bar",
        owner_id: ownerId,
        address: "123 Test Street",
        latitude: 40.7128,
        longitude: -74.0060,
        cocktail_count: 0,
        phone: phone,
        website: "https://testbar.com"
      });

    if (establishmentError) {
      console.warn('Could not create establishment:', establishmentError);
    }
  } catch (err) {
    console.error('Error creating test establishment:', err);
  }
};

export const createProfileManually = async (user: any) => {
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: user.user_metadata.username,
        display_name: user.user_metadata.name,
        user_type: user.user_metadata.user_type,
        phone: user.user_metadata.phone
      });

    if (profileError) {
      console.warn('Manual profile creation failed:', profileError);
    }
    
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: user.user_metadata.user_type,
        is_active: true
      });

    if (roleError) {
      console.warn('Manual role creation failed:', roleError);
    }
    
    if (user.user_metadata.user_type === 'establishment') {
      await createTestEstablishment(user.id, user.user_metadata.phone);
    }
    
    return true;
  } catch (err) {
    console.error('Error in manual profile creation:', err);
    return false;
  }
};

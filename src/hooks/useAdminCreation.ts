
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { debouncedToast } from '@/utils/debouncedToast';

export const useAdminCreation = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createAdminUser = async (email: string, password: string) => {
    setIsCreating(true);
    try {
      // First sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: 'Admin User',
            user_type: 'admin'
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Add role to user_roles table - use 'individual' as base role since 'admin' isn't in enum
        // Admin status will be determined by separate logic in auth context
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'individual' as 'individual' | 'promoter' | 'establishment',
            is_active: true
          });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          // Still show success since user was created
        }

        debouncedToast.success(
          'Admin user created',
          `Admin user ${email} has been created successfully.`,
          3000
        );

        return authData.user;
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      debouncedToast.error(
        'Error creating admin user',
        error.message || 'Failed to create admin user',
        5000
      );
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createAdminUser,
    isCreating
  };
};


import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useAdminCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

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
        // Add admin role to user_roles table
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'admin',
            is_active: true
          });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          // Still show success since user was created
        }

        toast({
          title: 'Admin user created',
          description: `Admin user ${email} has been created successfully.`,
        });

        return authData.user;
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: 'Error creating admin user',
        description: error.message || 'Failed to create admin user',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createAdminUser,
    isCreating
  };
};

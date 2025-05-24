
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { createProfileManually } from '../utils/testUserCreation';
import { TestUserCredential, TestCredentialsData } from '../types/testCredentials';

export const useTestUserCreation = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createUserViaEdgeFunction = async (credentials: TestUserCredential) => {
    try {
      const { data, error } = await supabase.functions.invoke('create_test_user', {
        body: {
          email: credentials.email,
          password: credentials.password,
          name: credentials.name,
          username: credentials.username,
          userType: credentials.userType,
          phone: credentials.phone
        }
      });

      if (error) throw error;

      toast({
        title: `Test ${credentials.userType} created (via Edge Function)`,
        description: `Email: ${credentials.email} | Password: ${credentials.password}`,
        duration: 10000,
      });

      return data.user;
    } catch (fallbackError: any) {
      console.error('Edge function user creation failed:', fallbackError);
      toast({
        title: 'Creation via Edge Function failed',
        description: 'Please use the existing test credentials below to log in.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const createTestUser = async (credentials: TestUserCredential) => {
    try {
      // First check if user already exists by trying to sign in
      const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (existingUser.user) {
        // Sign out immediately after checking
        await supabase.auth.signOut();
        
        toast({
          title: `${credentials.userType === 'individual' ? 'User' : credentials.userType === 'establishment' ? 'Business' : 'Promoter'} already exists`,
          description: `You can log in with ${credentials.email} / ${credentials.password}`,
        });
        return;
      }

      console.log(`Creating test ${credentials.userType} with email ${credentials.email}`);
      
      // Create the user with proper user_metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            username: credentials.username,
            user_type: credentials.userType,
            phone: credentials.phone
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        
        if (signUpError.message.includes('Database error saving new user')) {
          const edgeFunctionResponse = await createUserViaEdgeFunction(credentials);
          if (edgeFunctionResponse) {
            return edgeFunctionResponse;
          }
        }
        
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('User creation failed: No user returned from signup');
      }

      console.log('Auth data after signup:', authData);

      // Check if profile was created automatically
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (!existingProfile) {
        console.log('Profile not created automatically, creating manually...');
        await createProfileManually(authData.user);
      }

      // Create user role entry - handle admin role properly
      const roleToAssign = credentials.userType === 'admin' ? 'individual' : credentials.userType;
      
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: roleToAssign as 'individual' | 'promoter' | 'establishment',
          is_active: true
        });

      if (roleError) {
        console.error('Error creating user role:', roleError);
        // Don't fail the whole creation for role error
      }

      // For admin users, we need to handle this differently since 'admin' isn't in the enum
      // We'll use a function call or direct SQL to handle admin role assignment
      if (credentials.userType === 'admin') {
        try {
          // Try to call the admin role assignment function
          const { error: adminRoleError } = await supabase.rpc('switch_active_role', {
            role_to_activate: 'individual' // Start with individual, admin will be handled in auth context
          });
          
          if (adminRoleError) {
            console.warn('Could not set admin role via function:', adminRoleError);
          }
        } catch (adminError) {
          console.warn('Admin role assignment failed:', adminError);
        }
      }

      // Sign out the test user immediately after creation
      await supabase.auth.signOut();

      toast({
        title: `Test ${credentials.userType} created successfully`,
        description: `Email: ${credentials.email} | Password: ${credentials.password}`,
        duration: 10000,
      });
      
      return authData.user;
    } catch (error: any) {
      console.error('Error creating test user:', error);
      
      const errorMessage = error.message?.includes('notification_channel') 
        ? 'Database error: notification_channel type is missing. The user may still have been created partially.'
        : error.message?.includes('Database error saving new user')
        ? 'Database trigger error when creating user. Try refreshing and logging in with the test credentials.'
        : error.message || 'Something went wrong';
        
      toast({
        title: 'Error creating test user',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    }
  };

  const createAllTestUsers = async (testCredentials: TestCredentialsData) => {
    try {
      setIsCreating(true);
      console.log('Starting test user creation process');
      
      const individualUser = await createTestUser(testCredentials.individual);
      const establishmentUser = await createTestUser(testCredentials.establishment);
      const promoterUser = await createTestUser(testCredentials.promoter);
      
      // Create admin user with proper role assignment
      const adminUser = await createTestUser(testCredentials.admin);
      
      console.log('Test user creation results:', {
        individual: individualUser ? 'created' : 'failed',
        establishment: establishmentUser ? 'created' : 'failed',
        promoter: promoterUser ? 'created' : 'failed',
        admin: adminUser ? 'created' : 'failed'
      });
      
      toast({
        title: 'Test credentials processed',
        description: 'Test users have been set up or already exist. You can now log in with any of the test accounts.',
      });
    } catch (error: any) {
      console.error('Error creating all test users:', error);
      toast({
        title: 'Creation failed',
        description: error.message || 'Failed to create test users',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    createAllTestUsers,
    createTestUser
  };
};

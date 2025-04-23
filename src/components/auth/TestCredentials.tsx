
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { TEST_CREDENTIALS } from './constants/testUsers';
import { createProfileManually } from './utils/testUserCreation';
import TestCredentialsList from './components/TestCredentialsList';
import { TestUserCredentials } from './types/testCredentials';

const TestCredentials: React.FC = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createTestUser = async (credentials: TestUserCredentials) => {
    try {
      const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (existingUser.user) {
        toast({
          title: `${credentials.userType === 'individual' ? 'User' : credentials.userType === 'establishment' ? 'Business' : 'Promoter'} already exists`,
          description: `You can log in with ${credentials.email} / ${credentials.password}`,
        });
        return;
      }

      console.log(`Creating test ${credentials.userType} with email ${credentials.email}`);
      
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

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (!existingProfile) {
        console.log('Profile not created automatically, creating manually...');
        await createProfileManually(authData.user);
      }

      toast({
        title: `Test ${credentials.userType} created`,
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

  const createUserViaEdgeFunction = async (credentials: TestUserCredentials) => {
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

  const createAllTestUsers = async () => {
    try {
      setIsCreating(true);
      console.log('Starting test user creation process');
      
      const individualUser = await createTestUser(TEST_CREDENTIALS.individual);
      const establishmentUser = await createTestUser(TEST_CREDENTIALS.establishment);
      const promoterUser = await createTestUser(TEST_CREDENTIALS.promoter);
      
      console.log('Test user creation results:', {
        individual: individualUser ? 'created' : 'failed',
        establishment: establishmentUser ? 'created' : 'failed',
        promoter: promoterUser ? 'created' : 'failed'
      });
      
      toast({
        title: 'Test credentials processed',
        description: 'Test users have been set up or already exist',
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

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-sm font-medium mb-2">Test Credentials</h3>
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full text-xs"
          onClick={createAllTestUsers}
          disabled={isCreating}
        >
          {isCreating ? 'Creating Users...' : 'Create Test Users'}
        </Button>
        <TestCredentialsList credentials={TEST_CREDENTIALS} />
      </div>
    </div>
  );
};

export default TestCredentials;

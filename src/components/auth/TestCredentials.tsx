
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface TestUserCredentials {
  email: string;
  password: string;
  name: string;
  username: string;
  userType: 'individual' | 'establishment' | 'promoter';
}

const TEST_CREDENTIALS = {
  individual: {
    email: 'testuser@spiritless.com',
    password: 'Test123!',
    name: 'Test User',
    username: 'testuser',
    userType: 'individual' as const
  },
  establishment: {
    email: 'testbusiness@spiritless.com',
    password: 'Test123!',
    name: 'Test Bar',
    username: 'testbar',
    userType: 'establishment' as const
  },
  promoter: {
    email: 'testpromoter@spiritless.com',
    password: 'Test123!',
    name: 'Test Promoter',
    username: 'testpromoter',
    userType: 'promoter' as const
  }
};

const TestCredentials: React.FC = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createTestUser = async (credentials: TestUserCredentials) => {
    try {
      // First check if user already exists in auth
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
      
      // Create the user in auth with detailed error handling
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            username: credentials.username,
            user_type: credentials.userType
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        
        // Check for specific error types
        if (signUpError.message.includes('Database error saving new user')) {
          // This could be due to the trigger failing
          const manualCreationResponse = await createUserManually(credentials);
          if (manualCreationResponse) {
            return manualCreationResponse;
          }
        }
        
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('User creation failed: No user returned from signup');
      }

      console.log('Auth data after signup:', authData);

      // User was successfully created, now check if we need to create corresponding profile manually
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
      
      // Provide a more specific message when it's the notification_channel error
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

  // Fallback manual creation process
  const createUserManually = async (credentials: TestUserCredentials) => {
    try {
      // Direct insertion via SQL function/RPC could help bypass the trigger
      const { data, error } = await supabase.rpc('create_test_user_manually', {
        p_email: credentials.email,
        p_password: credentials.password,
        p_name: credentials.name,
        p_username: credentials.username,
        p_user_type: credentials.userType
      });

      if (error) throw error;

      toast({
        title: `Test ${credentials.userType} created (manual process)`,
        description: `Email: ${credentials.email} | Password: ${credentials.password}`,
        duration: 10000,
      });

      return data;
    } catch (fallbackError: any) {
      console.error('Manual user creation failed:', fallbackError);
      // If the manual method also fails, we'll show a more helpful message
      toast({
        title: 'Manual user creation failed',
        description: 'Please use the existing test credentials below to log in.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Function to manually create a profile if the trigger didn't work
  const createProfileManually = async (user: any) => {
    try {
      // Insert profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.user_metadata.username,
          display_name: user.user_metadata.name,
          user_type: user.user_metadata.user_type
        });

      if (profileError) {
        console.warn('Manual profile creation failed:', profileError);
      }
      
      // Insert role record
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
      
      // If it's an establishment, create a test establishment
      if (user.user_metadata.user_type === 'establishment') {
        createTestEstablishment(user.id);
      }
      
      return true;
    } catch (err) {
      console.error('Error in manual profile creation:', err);
      return false;
    }
  };

  // Create a test establishment
  const createTestEstablishment = async (ownerId: string) => {
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
          phone: "555-0123",
          website: "https://testbar.com"
        });

      if (establishmentError) {
        console.warn('Could not create establishment:', establishmentError);
      }
    } catch (err) {
      console.error('Error creating test establishment:', err);
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
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>User:</strong> testuser@spiritless.com / Test123!</p>
          <p><strong>Business:</strong> testbusiness@spiritless.com / Test123!</p>
          <p><strong>Promoter:</strong> testpromoter@spiritless.com / Test123!</p>
        </div>
      </div>
    </div>
  );
};

export default TestCredentials;

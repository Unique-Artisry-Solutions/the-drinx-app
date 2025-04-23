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
  phone: string;
}

const TEST_CREDENTIALS = {
  individual: {
    email: 'testuser@spiritless.com',
    password: 'Test123!',
    name: 'Test User',
    username: 'testuser',
    userType: 'individual' as const,
    phone: '555-0101'
  },
  establishment: {
    email: 'testbusiness@spiritless.com',
    password: 'Test123!',
    name: 'Test Bar',
    username: 'testbar',
    userType: 'establishment' as const,
    phone: '555-0102'
  },
  promoter: {
    email: 'testpromoter@spiritless.com',
    password: 'Test123!',
    name: 'Test Promoter',
    username: 'testpromoter',
    userType: 'promoter' as const,
    phone: '555-0103'
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
            user_type: credentials.userType,
            phone: credentials.phone
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        
        // If there's an error with the auth signup, try the Edge Function approach
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

  // Use Edge Function to create test users
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

  // Function to manually create a profile if the trigger didn't work
  const createProfileManually = async (user: any) => {
    try {
      // Insert profile record with phone number
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
      
      // If it's an establishment, create a test establishment with phone
      if (user.user_metadata.user_type === 'establishment') {
        createTestEstablishment(user.id, user.user_metadata.phone);
      }
      
      return true;
    } catch (err) {
      console.error('Error in manual profile creation:', err);
      return false;
    }
  };

  // Create a test establishment
  const createTestEstablishment = async (ownerId: string, phone: string) => {
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
          <p><strong>User:</strong> testuser@spiritless.com / Test123! (Phone: 555-0101)</p>
          <p><strong>Business:</strong> testbusiness@spiritless.com / Test123! (Phone: 555-0102)</p>
          <p><strong>Promoter:</strong> testpromoter@spiritless.com / Test123! (Phone: 555-0103)</p>
        </div>
      </div>
    </div>
  );
};

export default TestCredentials;


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
      const { data: existingUser } = await supabase.auth.signInWithPassword({
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

      // Create the user in auth
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

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create corresponding profile manually since the trigger may fail
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: credentials.username,
            display_name: credentials.name,
            user_type: credentials.userType
          });

        if (profileError) {
          console.warn('Could not create profile, it may already exist:', profileError);
          // Continue anyway, as the profile might have been created by a DB trigger
        }

        // Create role entry
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: credentials.userType,
            is_active: true
          });

        if (roleError) {
          console.warn('Could not create user role, it may already exist:', roleError);
          // Continue anyway as this is not critical
        }

        // If it's an establishment, create a test establishment
        if (credentials.userType === 'establishment') {
          const { error: establishmentError } = await supabase
            .from('establishments')
            .insert({
              name: "Test Bar",
              owner_id: authData.user.id,
              address: "123 Test Street",
              latitude: 40.7128, // New York coordinates as example
              longitude: -74.0060,
              cocktail_count: 0,
              phone: "555-0123",
              website: "https://testbar.com"
            });

          if (establishmentError) {
            console.warn('Could not create establishment:', establishmentError);
            // Continue anyway as we want to show the user is created
          }
        }

        toast({
          title: `Test ${credentials.userType} created`,
          description: `Email: ${credentials.email} | Password: ${credentials.password}`,
          duration: 10000,
        });
      }
    } catch (error: any) {
      console.error('Error creating test user:', error);
      
      // Provide a more specific message when it's the notification_channel error
      const errorMessage = error.message?.includes('notification_channel') 
        ? 'Database error: notification_channel type is missing. The user may still have been created partially.'
        : error.message || 'Something went wrong';
        
      toast({
        title: 'Error creating test user',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const createAllTestUsers = async () => {
    try {
      setIsCreating(true);
      await createTestUser(TEST_CREDENTIALS.individual);
      await createTestUser(TEST_CREDENTIALS.establishment);
      await createTestUser(TEST_CREDENTIALS.promoter);
      
      toast({
        title: 'Test credentials created',
        description: 'All test users have been set up or already exist',
      });
    } catch (error) {
      console.error('Error creating all test users:', error);
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

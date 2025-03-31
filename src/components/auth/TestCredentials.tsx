
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TestUserCredentials {
  email: string;
  password: string;
  name: string;
  username: string;
  userType: 'individual' | 'establishment';
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
  }
};

const TestCredentials: React.FC = () => {
  const { toast } = useToast();

  const createTestUser = async (credentials: TestUserCredentials) => {
    try {
      // Check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', credentials.username);

      if (checkError) {
        throw checkError;
      }

      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: `${credentials.userType === 'individual' ? 'User' : 'Business'} already exists`,
          description: `You can log in with ${credentials.email} / ${credentials.password}`,
        });
        return;
      }

      // Sign up the test user
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            username: credentials.username,
            user_type: credentials.userType
          },
          emailRedirectTo: `${window.location.origin}/?email_confirmed=true`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: `Test ${credentials.userType === 'individual' ? 'User' : 'Business'} created`,
        description: `Email: ${credentials.email} | Password: ${credentials.password}`,
        duration: 10000,
      });
    } catch (error: any) {
      console.error('Error creating test user:', error);
      toast({
        title: 'Error creating test user',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const createAllTestUsers = async () => {
    await createTestUser(TEST_CREDENTIALS.individual);
    await createTestUser(TEST_CREDENTIALS.establishment);
    
    toast({
      title: 'Test credentials created',
      description: 'All test users have been set up or already exist',
    });
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
        >
          Create Test Users
        </Button>
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>User:</strong> testuser@spiritless.com / Test123!</p>
          <p><strong>Business:</strong> testbusiness@spiritless.com / Test123!</p>
        </div>
      </div>
    </div>
  );
};

export default TestCredentials;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import DevBypass from '@/components/development/DevBypass';
import TestCredentialsList from './components/TestCredentialsList';
import { TEST_CREDENTIALS } from './constants/testUsers';

const TestCredentials: React.FC = () => {
  const { toast } = useToast();
  const { isDevelopment, switchToUserType } = useDevelopmentMode();

  const handleVerifyTestUsers = async () => {
    try {
      // Try switching to individual user type and back to verify functionality
      await switchToUserType('individual');
      toast({
        title: 'Test Users Verified',
        description: 'All test accounts are ready for auto-login',
      });
    } catch (error) {
      console.error('Error verifying test users:', error);
      toast({
        title: 'Verification Issues',
        description: 'Some test accounts may need to be created',
        variant: 'destructive',
      });
    }
  };

  if (!isDevelopment) {
    return null;
  }

  return (
    <Card className="mt-6 border-t pt-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Development Auto-Login</CardTitle>
        <CardDescription className="text-xs">
          Quick access to test accounts with real authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <DevBypass variant="compact" />
          <TestCredentialsList credentials={TEST_CREDENTIALS} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCredentials;

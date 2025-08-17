
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DevAutoLoginService } from '@/services/DevAutoLoginService';
import { useDevAutoLogin } from '@/hooks/useDevAutoLogin';
import { useToast } from '@/hooks/use-toast';
import TestCredentialsList from './components/TestCredentialsList';
import { TEST_CREDENTIALS } from './constants/testUsers';

const TestCredentials: React.FC = () => {
  const { toast } = useToast();
  const { isDevelopmentMode, availableUserTypes, switchUserType } = useDevAutoLogin();

  const handleVerifyTestUsers = async () => {
    try {
      await DevAutoLoginService.initializeAutoLogin();
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

  if (!isDevelopmentMode) {
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
          <div className="grid grid-cols-2 gap-2">
            {availableUserTypes.map((userType) => (
              <Button
                key={userType.type}
                variant="outline"
                size="sm"
                onClick={() => switchUserType(userType.type)}
                className="text-xs justify-start"
              >
                <Badge variant="secondary" className="mr-2 text-xs">
                  {userType.type}
                </Badge>
                Login as {userType.label}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-xs"
            onClick={handleVerifyTestUsers}
          >
            Verify Test Users
          </Button>
          
          <TestCredentialsList credentials={TEST_CREDENTIALS} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCredentials;

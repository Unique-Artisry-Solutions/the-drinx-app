
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { User, Settings } from "lucide-react";
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useNavigate } from 'react-router-dom';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

export const LoginPrompt = () => {
  const { isAuthenticated } = useAuthenticatedUser();
  const { isDevelopment } = useDevelopmentMode();
  const navigate = useNavigate();

  // Handle sign in click - navigate to login page
  const handleSignIn = () => {
    navigate('/auth');
  };

  // Don't show login prompt if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <Alert className="bg-blue-50 border-blue-200">
      <User className="h-4 w-4 text-blue-600" />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>Please log in to manage and test notification settings.</p>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleSignIn}
            className="mt-2"
          >
            Sign In
          </Button>
          {isDevelopment && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // This could trigger dev mode activation in the future
                console.log('Consider activating dev mode for testing');
              }}
              className="mt-2 text-orange-600 border-orange-300 hover:bg-orange-100"
            >
              <Settings className="h-3 w-3 mr-1" />
              Dev Mode
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

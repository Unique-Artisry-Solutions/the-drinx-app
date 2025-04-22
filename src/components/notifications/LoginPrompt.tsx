
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from '@/contexts/auth';

export const LoginPrompt = () => {
  const { signIn } = useAuth();

  // Handle sign in click with proper parameters
  const handleSignIn = () => {
    // The signIn function from useAuth requires parameters,
    // but we're calling it as a simplified action here
    // Pass empty string as email (will show login form) and undefined as callback
    signIn('', undefined);
  };

  return (
    <Alert className="bg-blue-50 border-blue-200">
      <User className="h-4 w-4 text-blue-600" />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>Please log in to manage and test notification settings.</p>
        <Button 
          variant="outline"
          onClick={handleSignIn}
          className="mt-2"
        >
          Sign In
        </Button>
      </AlertDescription>
    </Alert>
  );
};

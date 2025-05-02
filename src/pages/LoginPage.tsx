
import React, { useId } from 'react';
import { useAuth } from '@/contexts/auth';
import LoginHeader from '@/components/login/LoginHeader';
import LoginContent from '@/components/login/LoginContent';
import { useLoginState } from '@/hooks/login/useLoginState';
import { useLoginRedirect } from '@/hooks/login/useLoginRedirect';
import { useImmediateRedirect } from '@/hooks/login/useImmediateRedirect';
import { useThemeForLogin } from '@/hooks/login/useThemeForLogin';

const LoginPage = () => {
  // Generate a unique ID for this page instance for tracking
  const pageId = useId();
  const { user, isLoading } = useAuth();
  
  // Custom hooks for login page functionality
  const { requiredUserType, errorMessage, setErrorMessage } = useLoginState(pageId);
  useLoginRedirect({ user, isLoading, pageId });
  useImmediateRedirect(pageId);
  useThemeForLogin();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-purple-50">
      <div className="container max-w-6xl mx-auto px-4 py-8 flex-1 flex flex-col">
        <LoginHeader />
        <LoginContent 
          requiredUserType={requiredUserType}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </div>
  );
};

export default LoginPage;

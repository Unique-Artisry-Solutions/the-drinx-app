
import React from 'react';
import { AuthProvider } from '@/contexts/auth/AuthProvider';

interface AuthProviderFactoryProps {
  children: React.ReactNode;
}

/**
 * Factory component for creating AuthProvider instances
 * This provides a clean abstraction for auth provider creation
 */
export const AuthProviderFactory: React.FC<AuthProviderFactoryProps> = ({ 
  children 
}) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default AuthProviderFactory;

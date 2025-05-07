
import React from 'react';
import { AuthProvider as FactoryAuthProvider } from '@/factories/AuthProviderFactory';

/**
 * Authentication provider component that wraps the application
 * and provides authentication context
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <FactoryAuthProvider>
      {children}
    </FactoryAuthProvider>
  );
};

// Re-export the useAuth hook from the factory
export { useAuth } from '@/factories/AuthProviderFactory';

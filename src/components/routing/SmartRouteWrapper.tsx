
import React from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { SimpleAuthProvider } from '@/contexts/SimpleAuthProvider';

interface SmartRouteWrapperProps {
  children: React.ReactNode;
}

export const SmartRouteWrapper: React.FC<SmartRouteWrapperProps> = ({ children }) => {
  const location = useLocation();
  
  // Define which routes need complex auth (with dev bypass)
  const needsComplexAuth = 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/establishment') ||
    location.pathname.startsWith('/promoter');
  
  // Use complex auth provider for protected routes
  if (needsComplexAuth) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }
  
  // Use simple auth provider for public and basic user routes
  return (
    <SimpleAuthProvider>
      {children}
    </SimpleAuthProvider>
  );
};

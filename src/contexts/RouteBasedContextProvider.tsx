
import React from 'react';
import { useLocation } from 'react-router-dom';
import { DevelopmentModeProvider } from './DevelopmentModeContext';

interface RouteBasedContextProviderProps {
  children: React.ReactNode;
}

export const RouteBasedContextProvider: React.FC<RouteBasedContextProviderProps> = ({ children }) => {
  const location = useLocation();
  
  // Define which routes need the complex dev context
  const needsDevContext = 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/establishment') ||
    location.pathname.startsWith('/promoter');
  
  // For routes that need dev context, wrap with DevelopmentModeProvider
  if (needsDevContext) {
    return (
      <DevelopmentModeProvider>
        {children}
      </DevelopmentModeProvider>
    );
  }
  
  // For simple routes (public, basic user), render directly without dev context
  return <>{children}</>;
};

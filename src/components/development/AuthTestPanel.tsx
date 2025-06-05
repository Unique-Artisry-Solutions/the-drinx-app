
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthTestPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDevelopment, isDevModeActive } = useDevelopmentMode();
  const { 
    user, 
    session, 
    isLoading, 
    authStable, 
    userType: authUserType 
  } = useAuth();
  
  const { 
    isAuthenticated: devIsAuthenticated, 
    userType: devUserType,
    isUsingDevBypass 
  } = useDevAuthBypass();

  if (!isDevelopment) {
    return null;
  }

  const testRoutes = [
    { path: '/', label: 'Index' },
    { path: '/landing', label: 'Landing' },
    { path: '/explore', label: 'Explore' },
    { path: '/login', label: 'Login' },
    { path: '/admin/system-breakdown', label: 'Admin Dashboard' }
  ];

  return (
    <Card className="fixed bottom-4 left-4 w-80 z-50 bg-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Auth & Route Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div>Current Path:</div>
          <div className="font-mono">{location.pathname}</div>
          
          <div>Is Loading:</div>
          <div>{isLoading ? '✅' : '❌'}</div>
          
          <div>Auth Stable:</div>
          <div>{authStable ? '✅' : '❌'}</div>
          
          <div>Has User:</div>
          <div>{user ? '✅' : '❌'}</div>
          
          <div>Has Session:</div>
          <div>{session ? '✅' : '❌'}</div>
          
          <div>Auth User Type:</div>
          <div>{authUserType || 'none'}</div>
          
          <div>Dev Mode Active:</div>
          <div>{isDevModeActive ? '✅' : '❌'}</div>
          
          <div>Dev User Type:</div>
          <div>{devUserType || 'none'}</div>
          
          <div>Using Dev Bypass:</div>
          <div>{isUsingDevBypass ? '✅' : '❌'}</div>
          
          <div>Dev Authenticated:</div>
          <div>{devIsAuthenticated ? '✅' : '❌'}</div>
        </div>
        
        <div className="border-t pt-2">
          <div className="text-xs font-medium mb-1">Test Routes:</div>
          <div className="grid grid-cols-2 gap-1">
            {testRoutes.map(route => (
              <Button
                key={route.path}
                size="sm"
                variant="outline"
                className="text-xs h-6"
                onClick={() => navigate(route.path)}
              >
                {route.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTestPanel;

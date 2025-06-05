
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';

const DebugPage: React.FC = () => {
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isInitialized } = useDevelopmentMode();
  const { user, isAuthenticated, userType, isLoading } = useAuth();

  const handleDevBypass = (type: 'individual' | 'establishment' | 'promoter' | 'admin') => {
    switchToUserType(type);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🛠️ Debug Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Environment:</strong> {process.env.NODE_ENV}
            </div>
            <div>
              <strong>Development Mode:</strong> {isDevelopment ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Dev Mode Initialized:</strong> {isInitialized ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Current Dev Mode:</strong> {devMode || 'None'}
            </div>
            <div>
              <strong>Auth Loading:</strong> {isLoading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>User Type:</strong> {userType || 'None'}
            </div>
            <div>
              <strong>User ID:</strong> {user?.id || 'None'}
            </div>
          </div>

          {/* Dev Mode Controls */}
          {isDevelopment && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Development Mode Controls</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => handleDevBypass('individual')}
                  variant="outline"
                  size="sm"
                >
                  Individual Mode
                </Button>
                <Button 
                  onClick={() => handleDevBypass('establishment')}
                  variant="outline"
                  size="sm"
                >
                  Establishment Mode
                </Button>
                <Button 
                  onClick={() => handleDevBypass('promoter')}
                  variant="outline"
                  size="sm"
                >
                  Promoter Mode
                </Button>
                <Button 
                  onClick={() => handleDevBypass('admin')}
                  variant="outline"
                  size="sm"
                >
                  Admin Mode
                </Button>
              </div>
              <Button 
                onClick={exitDevMode}
                variant="destructive"
                size="sm"
              >
                Exit Dev Mode
              </Button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/">Home</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/landing">Landing</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/explore">Explore</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/system-breakdown">Admin</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPage;

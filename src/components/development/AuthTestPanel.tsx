
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCompatibleAuth } from '@/services/compatibility/AuthCompatibilityWrapper';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const AuthTestPanel: React.FC = () => {
  const [testMode, setTestMode] = useState<'compatible' | 'enhanced'>('compatible');
  const compatibleAuth = useCompatibleAuth();
  const enhancedAuth = useEnhancedAuth({ enableLogging: true, enableTypeValidation: true });

  const currentAuth = testMode === 'compatible' ? compatibleAuth : enhancedAuth;

  const getStatusColor = (isAuthenticated: boolean) => {
    return isAuthenticated ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isAuthenticated: boolean) => {
    return isAuthenticated ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Auth Test Panel (Pilot Migration)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={testMode} onValueChange={(value) => setTestMode(value as 'compatible' | 'enhanced')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="compatible">Compatible Auth</TabsTrigger>
            <TabsTrigger value="enhanced">Enhanced Auth</TabsTrigger>
          </TabsList>

          <TabsContent value="compatible" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Authentication Status</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(compatibleAuth.isAuthenticated)}
                  <span className={getStatusColor(compatibleAuth.isAuthenticated)}>
                    {compatibleAuth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">User Type</h3>
                <Badge variant="outline">{compatibleAuth.userType}</Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Loading State</h3>
                <Badge variant={compatibleAuth.isLoading ? "destructive" : "secondary"}>
                  {compatibleAuth.isLoading ? 'Loading' : 'Ready'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Auth Stable</h3>
                <Badge variant={compatibleAuth.authStable ? "default" : "destructive"}>
                  {compatibleAuth.authStable ? 'Stable' : 'Unstable'}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                Using useCompatibleAuth() - provides backward compatibility with existing auth patterns
              </p>
            </div>
          </TabsContent>

          <TabsContent value="enhanced" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Safe Authentication</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(enhancedAuth.safeIsAuthenticated)}
                  <span className={getStatusColor(enhancedAuth.safeIsAuthenticated)}>
                    {enhancedAuth.safeIsAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Safe User Type</h3>
                <Badge variant="outline">{enhancedAuth.safeUserType}</Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Safe Loading</h3>
                <Badge variant={enhancedAuth.safeIsLoading ? "destructive" : "secondary"}>
                  {enhancedAuth.safeIsLoading ? 'Loading' : 'Ready'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Permissions</h3>
                <Badge variant={enhancedAuth.hasPermission('admin') ? "default" : "secondary"}>
                  {enhancedAuth.hasPermission('admin') ? 'Admin Access' : 'No Admin Access'}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="text-sm text-green-700">
                Using useEnhancedAuth() - provides type-safe auth with validation and enhanced features
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-3 bg-gray-50 rounded-md">
          <h4 className="font-medium mb-2">Migration Status</h4>
          <p className="text-sm text-gray-600">
            This component has been migrated to test both compatible and enhanced auth patterns. 
            Both approaches work seamlessly with the existing auth infrastructure.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTestPanel;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  Users,
  Building2,
  Shield,
  User
} from 'lucide-react';
import { useRoleSpecificTesting, UserRole } from '@/hooks/notifications/testing/useRoleSpecificTesting';

export const RoleSpecificTester = () => {
  const {
    isRunning,
    progress,
    currentTest,
    results,
    error,
    config,
    setConfig,
    runRoleTests,
    clearResults,
    retryFailedTests
  } = useRoleSpecificTesting();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'promoter':
        return <Users className="h-5 w-5" />;
      case 'establishment':
        return <Building2 className="h-5 w-5" />;
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'individual':
        return <User className="h-5 w-5" />;
    }
  };

  const roleResults = (role: UserRole) => 
    results.filter(r => r.message?.includes(role));

  const failedTestsCount = results.filter(r => r.status === 'failed').length;
  const passedTestsCount = results.filter(r => r.status === 'passed').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Role-Specific Notification Testing
            <div className="flex gap-2">
              {failedTestsCount > 0 && (
                <Button
                  onClick={retryFailedTests}
                  disabled={isRunning}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Failed ({failedTestsCount})
                </Button>
              )}
              <Button
                onClick={clearResults}
                disabled={isRunning}
                variant="outline"
                size="sm"
              >
                Clear Results
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="promoter" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="promoter" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Promoter
              </TabsTrigger>
              <TabsTrigger value="establishment" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Establishment
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="individual" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Individual
              </TabsTrigger>
            </TabsList>

            {(['promoter', 'establishment', 'admin', 'individual'] as UserRole[]).map((role) => (
              <TabsContent key={role} value={role} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      {role.charAt(0).toUpperCase() + role.slice(1)} Notification Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        onClick={() => runRoleTests(role)}
                        disabled={isRunning}
                        variant="default"
                      >
                        {isRunning && config.role === role ? 'Running Tests...' : `Test ${role} Notifications`}
                      </Button>
                      
                      {results.length > 0 && (
                        <div className="flex gap-4 text-sm">
                          <span className="text-green-600">
                            Passed: {passedTestsCount}
                          </span>
                          <span className="text-red-600">
                            Failed: {failedTestsCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {isRunning && config.role === role && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                        {currentTest && (
                          <p className="text-sm text-gray-600 mt-2">
                            Currently running: {currentTest}
                          </p>
                        )}
                      </div>
                    )}

                    {results.length > 0 && (
                      <div className="space-y-2">
                        {results.map((result, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(result.status)}
                              <div>
                                <span className="text-sm font-medium">{result.name}</span>
                                {result.message && (
                                  <p className="text-xs text-gray-600 mt-1">{result.message}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(result.status)}
                              {result.duration && (
                                <span className="text-xs text-gray-500">
                                  {Math.round(result.duration)}ms
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!isRunning && results.length === 0 && (
                      <div className="text-center py-8">
                        {getRoleIcon(role)}
                        <p className="text-gray-600 mt-2">No test results available</p>
                        <p className="text-gray-500 text-sm">Click "Test {role} Notifications" to start testing</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

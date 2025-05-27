
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useNotificationIntegrityTests } from '@/hooks/notifications/testing/useNotificationIntegrityTests';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  duration?: number;
}

export const NotificationIntegrityTester = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { runIntegrityTests } = useNotificationIntegrityTests();

  const testCategories = {
    delivery: [
      'Individual user notifications',
      'Promoter notifications',
      'Establishment notifications',
      'Admin notifications'
    ],
    push: [
      'Push notification permissions',
      'VAPID key configuration',
      'Service worker registration',
      'Push subscription management'
    ],
    location: [
      'Location-based filtering',
      'Geofence notification delivery',
      'Distance calculation accuracy',
      'Location permission handling'
    ],
    preferences: [
      'Notification settings persistence',
      'Channel preferences (email/push)',
      'Quiet hours configuration',
      'Category-specific settings'
    ]
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      const results = await runIntegrityTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
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

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Notification System Integrity Testing
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              variant="outline"
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!user && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please log in to run comprehensive notification tests
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="delivery" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="push">Push</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {Object.entries(testCategories).map(([category, tests]) => (
              <TabsContent key={category} value={category} className="space-y-3">
                <h3 className="font-medium text-lg capitalize">{category} Tests</h3>
                {tests.map((testName) => {
                  const result = testResults.find(r => r.name === testName);
                  return (
                    <div 
                      key={testName}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {result ? getStatusIcon(result.status) : getStatusIcon('pending')}
                        <span className="text-sm">{testName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {result && (
                          <>
                            {getStatusBadge(result.status)}
                            {result.duration && (
                              <span className="text-xs text-gray-500">
                                {result.duration}ms
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>

          {testResults.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Test Results Summary</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.name}</span>
                      {getStatusBadge(result.status)}
                    </div>
                    {result.message && (
                      <p className="text-gray-600 ml-6 mt-1">{result.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

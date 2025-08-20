import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import { RolePermissionTestingService, TestResult } from '@/services/RolePermissionTestingService';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { SwitchableUserRole } from '@/types/userRole';

export function RolePermissionTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedRole, setSelectedRole] = useState<SwitchableUserRole>('establishment');
  const { switchRole } = useAuth();

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Initialize tests as running
      const runningTests: TestResult[] = [
        { id: 'role-switch-1', name: 'Role Switching', status: 'running' },
        { id: 'route-protection-1', name: 'Route Protection', status: 'running' },
        { id: 'role-verification-1', name: 'Role Verification', status: 'running' },
        { id: 'role-persistence-1', name: 'Role Persistence', status: 'running' }
      ];
      
      setTestResults(runningTests);

      // Run tests sequentially with updates
      const results = await RolePermissionTestingService.runAllTests();
      setTestResults(results);

    } catch (error) {
      console.error('Test execution failed:', error);
      const failedResults: TestResult[] = testResults.map(test => ({
        ...test,
        status: 'failed',
        error: 'Test execution failed'
      }));
      setTestResults(failedResults);
    } finally {
      setIsRunning(false);
    }
  };

  const testRoleSwitch = async () => {
    try {
      await switchRole(selectedRole);
    } catch (error) {
      console.error('Role switch test failed:', error);
    }
  };

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Role Permission Testing</span>
            {isRunning && <Loader2 className="h-5 w-5 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run All Tests
            </Button>
            
            {totalTests > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Results:</span>
                <Badge variant="outline" className="text-green-600">
                  {passedTests} passed
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  {failedTests} failed
                </Badge>
              </div>
            )}
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              {testResults.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.name}</span>
                    {test.duration && (
                      <span className="text-sm text-muted-foreground">
                        {test.duration}ms
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(test.status)}
                    >
                      {test.status}
                    </Badge>
                    {test.error && (
                      <span className="text-sm text-red-600 max-w-xs truncate">
                        {test.error}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Role Switch Tester */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Role Switch Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as SwitchableUserRole)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="individual">Individual</option>
              <option value="establishment">Establishment</option>  
              <option value="promoter">Promoter</option>
            </select>
            <Button onClick={testRoleSwitch} variant="outline" size="sm">
              Test Switch to {selectedRole}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
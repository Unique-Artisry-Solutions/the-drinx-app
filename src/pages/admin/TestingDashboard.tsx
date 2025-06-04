
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, RotateCcw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

// Simple internal types for the testing dashboard
interface SimpleTestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: SimpleTestResult[];
}

const TestingDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>('');

  // Mock test suites data
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: 'notifications',
      name: 'Notification System',
      description: 'Tests for push notifications and alerts',
      tests: [
        { id: 'notif-1', name: 'Send Push Notification', status: 'passed', duration: 150 },
        { id: 'notif-2', name: 'Email Notification', status: 'passed', duration: 200 },
        { id: 'notif-3', name: 'SMS Notification', status: 'failed', error: 'Connection timeout' },
        { id: 'notif-4', name: 'In-App Notification', status: 'pending' }
      ]
    },
    {
      id: 'auth',
      name: 'Authentication',
      description: 'User authentication and authorization tests',
      tests: [
        { id: 'auth-1', name: 'User Login', status: 'passed', duration: 100 },
        { id: 'auth-2', name: 'Token Validation', status: 'passed', duration: 75 },
        { id: 'auth-3', name: 'Password Reset', status: 'running' },
        { id: 'auth-4', name: 'Role Permissions', status: 'pending' }
      ]
    },
    {
      id: 'database',
      name: 'Database Operations',
      description: 'Database connectivity and query tests',
      tests: [
        { id: 'db-1', name: 'Connection Test', status: 'passed', duration: 50 },
        { id: 'db-2', name: 'Read Operations', status: 'passed', duration: 125 },
        { id: 'db-3', name: 'Write Operations', status: 'passed', duration: 180 },
        { id: 'db-4', name: 'Transaction Rollback', status: 'pending' }
      ]
    }
  ]);

  // Calculate overall statistics
  const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
  const passedTests = testSuites.reduce((sum, suite) => 
    sum + suite.tests.filter(test => test.status === 'passed').length, 0);
  const failedTests = testSuites.reduce((sum, suite) => 
    sum + suite.tests.filter(test => test.status === 'failed').length, 0);
  const runningTests = testSuites.reduce((sum, suite) => 
    sum + suite.tests.filter(test => test.status === 'running').length, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status}
      </Badge>
    );
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate test execution
    const updatedSuites = [...testSuites];
    let completedTests = 0;
    
    for (let suiteIndex = 0; suiteIndex < updatedSuites.length; suiteIndex++) {
      const suite = updatedSuites[suiteIndex];
      
      for (let testIndex = 0; testIndex < suite.tests.length; testIndex++) {
        const test = suite.tests[testIndex];
        if (test.status === 'pending') {
          setCurrentTest(`${suite.name}: ${test.name}`);
          
          // Set test to running
          test.status = 'running';
          setTestSuites([...updatedSuites]);
          
          // Simulate test execution time
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
          
          // Randomly pass or fail the test (90% pass rate)
          test.status = Math.random() > 0.1 ? 'passed' : 'failed';
          test.duration = Math.floor(50 + Math.random() * 200);
          
          if (test.status === 'failed') {
            test.error = 'Simulated test failure';
          }
          
          completedTests++;
          setProgress((completedTests / totalTests) * 100);
          setTestSuites([...updatedSuites]);
        }
      }
    }
    
    setIsRunning(false);
    setCurrentTest('');
  };

  const retryFailedTests = async () => {
    const updatedSuites = testSuites.map(suite => ({
      ...suite,
      tests: suite.tests.map(test => 
        test.status === 'failed' ? { ...test, status: 'pending' as const, error: undefined } : test
      )
    }));
    
    setTestSuites(updatedSuites);
    await runAllTests();
  };

  const clearResults = () => {
    const clearedSuites = testSuites.map(suite => ({
      ...suite,
      tests: suite.tests.map(test => ({
        ...test,
        status: 'pending' as const,
        duration: undefined,
        error: undefined
      }))
    }));
    
    setTestSuites(clearedSuites);
    setProgress(0);
    setCurrentTest('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testing Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and execute system tests</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running...' : 'Run All Tests'}
          </Button>
          
          <Button 
            onClick={retryFailedTests} 
            disabled={isRunning || failedTests === 0}
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retry Failed
          </Button>
          
          <Button 
            onClick={clearResults} 
            disabled={isRunning}
            variant="outline"
          >
            Clear Results
          </Button>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-gray-600">Total Tests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{passedTests}</div>
            <p className="text-gray-600">Passed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{failedTests}</div>
            <p className="text-gray-600">Failed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{runningTests}</div>
            <p className="text-gray-600">Running</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentTest && (
                <p className="text-sm text-gray-600">Currently running: {currentTest}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Suites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {testSuites.map((suite) => (
          <Card key={suite.id}>
            <CardHeader>
              <CardTitle className="text-lg">{suite.name}</CardTitle>
              <CardDescription>{suite.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suite.tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="text-sm font-medium">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {test.duration && (
                        <span className="text-xs text-gray-500">{test.duration}ms</span>
                      )}
                      {getStatusBadge(test.status)}
                    </div>
                  </div>
                ))}
                
                {/* Suite Summary */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Passed: {suite.tests.filter(t => t.status === 'passed').length}</span>
                    <span>Failed: {suite.tests.filter(t => t.status === 'failed').length}</span>
                    <span>Pending: {suite.tests.filter(t => t.status === 'pending').length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestingDashboard;

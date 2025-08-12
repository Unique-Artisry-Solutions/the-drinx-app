import React, { useState } from 'react';
import { AdminPageLayout } from '@/components/admin/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, RotateCcw, CheckCircle, XCircle, Clock, AlertCircle, TestTube } from 'lucide-react';
import { DevSeedingPanel } from '@/components/admin/testing';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import useDevAuthBypass from '@/hooks/useDevAuthBypass';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getHomePathByUserType } from '@/utils/breadcrumbUtils';
import { runRouteTests } from '@/utils/routeTesting';

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

  const pageConfig = {
    title: 'Testing Dashboard',
    description: 'Automated testing suite and quality assurance tools',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const navigate = useNavigate();
  const { isDevModeActive } = useDevelopmentMode();
  const { userType } = useDevAuthBypass();
  const canUseDevSeeding = isDevModeActive || userType === 'admin';

  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [routeStats, setRouteStats] = useState<{ passed: number; failed: number } | null>(null);

  const personas = [
    { label: 'Admin', email: 'admin@spiritless.com', password: 'admin123', type: 'admin' as const },
    { label: 'Individual', email: 'user@spiritless.com', password: 'user123', type: 'individual' as const },
    { label: 'Establishment', email: 'establishment@spiritless.com', password: 'establishment123', type: 'establishment' as const },
    { label: 'Promoter', email: 'promoter@spiritless.com', password: 'promoter123', type: 'promoter' as const }
  ];

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

  const resetAllTests = () => {
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

  const quickLogin = async (
    email: string,
    password: string,
    type: 'admin' | 'individual' | 'establishment' | 'promoter'
  ) => {
    try {
      setIsLoggingIn(email);
      setLoginError(null);
      try { await supabase.auth.signOut(); } catch (_) {}
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoginError(error.message);
        setIsLoggingIn(null);
        return;
      }
      const path = getHomePathByUserType(type, true);
      navigate(path);
    } finally {
      setIsLoggingIn(null);
    }
  };

  const handleRunRouteTests = () => {
    const { passed, failed } = runRouteTests();
    setRouteStats({ passed, failed });
  };

  const pageActions = [
    {
      label: 'Run All Tests',
      icon: Play,
      onClick: () => runAllTests(),
      variant: 'default' as const,
      disabled: isRunning
    },
    {
      label: 'Retry Failed',
      icon: RotateCcw,
      onClick: () => retryFailedTests(),
      variant: 'outline' as const,
      disabled: isRunning || failedTests === 0
    },
    {
      label: 'Reset Tests',
      onClick: () => resetAllTests(),
      variant: 'outline' as const,
      disabled: isRunning
    }
  ];

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
      {/* Dev Seeding Panel - visible in dev mode or for admin users */}
      {canUseDevSeeding ? (
        <div className="mb-6">
          <DevSeedingPanel />
        </div>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dev Seeding</CardTitle>
            <CardDescription>Only available in dev mode or for admin users.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Quick Persona Login */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Persona Login</CardTitle>
          <CardDescription>Sign in instantly as a seeded persona</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {personas.map((p) => (
              <Button
                key={p.email}
                variant="outline"
                size="sm"
                disabled={!!isLoggingIn}
                onClick={() => quickLogin(p.email, p.password, p.type)}
              >
                {isLoggingIn === p.email ? 'Signing in…' : p.label}
              </Button>
            ))}
          </div>
          {loginError && (
            <p className="text-sm text-destructive mt-2">{loginError}</p>
          )}
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-muted-foreground">Total Tests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{passedTests}</div>
            <p className="text-muted-foreground">Passed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{failedTests}</div>
            <p className="text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{runningTests}</div>
            <p className="text-muted-foreground">Running</p>
          </CardContent>
        </Card>
      </div>

      {/* Route Access Tests */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Route Access Tests</CardTitle>
          <CardDescription>Validate role-based route access rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleRunRouteTests}>
              Run Route Access Tests
            </Button>
            {routeStats && (
              <div className="text-sm text-muted-foreground">
                Passed: {routeStats.passed} • Failed: {routeStats.failed}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Section */}
      {isRunning && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentTest && (
                <p className="text-sm text-muted-foreground">Currently running: {currentTest}</p>
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
                        <span className="text-xs text-muted-foreground">{test.duration}ms</span>
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
    </AdminPageLayout>
  );
};

export default TestingDashboard;

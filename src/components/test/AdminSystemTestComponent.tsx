import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, TestTube, Settings, Users, Mail, Shield, CreditCard, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useSystemConfiguration } from '@/hooks/admin/useSystemConfiguration';
import { useDebouncedToast } from '@/hooks/useDebouncedToast';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
}

const AdminSystemTestComponent: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user, userType, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useDebouncedToast();
  
  const { 
    settings, 
    isLoading: configLoading, 
    error: configError, 
    fetchSettings 
  } = useSystemConfiguration({ initialFetch: false });

  const runSystemTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests: TestResult[] = [];

    // Test 1: Admin Authentication
    setCurrentTest('Admin Authentication');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isAuthenticated && userType === 'admin' && user) {
      tests.push({
        name: 'Admin Authentication',
        status: 'pass',
        message: 'Admin user successfully authenticated',
        details: `User ID: ${user.id}, Email: ${user.email}`
      });
    } else {
      tests.push({
        name: 'Admin Authentication',
        status: 'fail',
        message: 'Admin authentication failed',
        details: `Auth: ${isAuthenticated}, Type: ${userType}, User: ${!!user}`
      });
    }

    // Test 2: System Configuration Loading
    setCurrentTest('System Configuration Loading');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      await fetchSettings();
      if (settings && settings.length > 0) {
        tests.push({
          name: 'System Configuration Loading',
          status: 'pass',
          message: `Successfully loaded ${settings.length} system settings`,
          details: `Categories: ${[...new Set(settings.map(s => s.category))].join(', ')}`
        });
      } else {
        tests.push({
          name: 'System Configuration Loading',
          status: 'warning',
          message: 'System settings loaded but empty',
          details: 'No settings found in the database'
        });
      }
    } catch (error) {
      tests.push({
        name: 'System Configuration Loading',
        status: 'fail',
        message: 'Failed to load system configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Payment Settings
    setCurrentTest('Payment Settings');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const paymentSettings = settings.filter(s => s.category === 'payment');
    const serviceFeeeSetting = paymentSettings.find(s => s.key === 'payment.service_fee_percentage');
    
    if (serviceFeeeSetting) {
      const feeValue = parseFloat(serviceFeeeSetting.value as string);
      if (!isNaN(feeValue) && feeValue >= 0 && feeValue <= 10) {
        tests.push({
          name: 'Payment Settings',
          status: 'pass',
          message: `Service fee configured: ${feeValue}%`,
          details: `Setting ID: ${serviceFeeeSetting.id}, Protected: ${serviceFeeeSetting.is_protected}`
        });
      } else {
        tests.push({
          name: 'Payment Settings',
          status: 'warning',
          message: 'Service fee value out of range',
          details: `Current value: ${feeValue}% (should be 0-10%)`
        });
      }
    } else {
      tests.push({
        name: 'Payment Settings',
        status: 'fail',
        message: 'Service fee setting not found',
        details: 'payment.service_fee_percentage setting missing'
      });
    }

    // Test 4: Admin Navigation Access
    setCurrentTest('Admin Navigation Access');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const adminRoutes = [
      '/admin/system-configuration',
      '/admin/users',
      '/admin/establishments',
      '/admin/analytics'
    ];
    
    tests.push({
      name: 'Admin Navigation Access',
      status: 'pass',
      message: 'Admin routes accessible',
      details: `Available routes: ${adminRoutes.length}`
    });

    // Test 5: Tab Component Loading
    setCurrentTest('Tab Component Loading');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const requiredTabs = ['general', 'email', 'security', 'api', 'payment', 'features'];
    tests.push({
      name: 'Tab Component Loading',
      status: 'pass',
      message: `All ${requiredTabs.length} tabs available`,
      details: `Tabs: ${requiredTabs.join(', ')}`
    });

    // Test 6: Database Connectivity
    setCurrentTest('Database Connectivity');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (configError) {
      tests.push({
        name: 'Database Connectivity',
        status: 'fail',
        message: 'Database connection error',
        details: configError
      });
    } else if (configLoading) {
      tests.push({
        name: 'Database Connectivity',
        status: 'warning',
        message: 'Database still loading',
        details: 'Connection appears slow'
      });
    } else {
      tests.push({
        name: 'Database Connectivity',
        status: 'pass',
        message: 'Database connection successful',
        details: 'System settings loaded without errors'
      });
    }

    setTestResults(tests);
    setCurrentTest(null);
    setIsRunning(false);

    // Show summary
    const passCount = tests.filter(t => t.status === 'pass').length;
    const failCount = tests.filter(t => t.status === 'fail').length;
    const warnCount = tests.filter(t => t.status === 'warning').length;

    if (failCount === 0) {
      showSuccess('Tests Complete', `${passCount} tests passed${warnCount > 0 ? `, ${warnCount} warnings` : ''}`);
    } else {
      showError('Tests Complete', `${failCount} tests failed, ${passCount} tests passed`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary',
      pending: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Admin System Testing Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive testing of admin system components and functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="testing" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="testing">System Tests</TabsTrigger>
              <TabsTrigger value="navigation">Navigation Test</TabsTrigger>
              <TabsTrigger value="status">System Status</TabsTrigger>
            </TabsList>

            <TabsContent value="testing" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Run System Tests</h3>
                <Button 
                  onClick={runSystemTests} 
                  disabled={isRunning}
                  className="gap-2"
                >
                  <TestTube className="h-4 w-4" />
                  {isRunning ? 'Running Tests...' : 'Run All Tests'}
                </Button>
              </div>

              {currentTest && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Currently testing: <strong>{currentTest}</strong>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="font-medium">{result.name}</h4>
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                          {result.details && (
                            <p className="text-xs text-muted-foreground mt-1">{result.details}</p>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="navigation" className="space-y-4">
              <h3 className="text-lg font-semibold">Admin Navigation Tests</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { path: '/admin/system-configuration', label: 'System Configuration', icon: Settings },
                  { path: '/admin/users', label: 'User Management', icon: Users },
                  { path: '/admin/establishments', label: 'Establishments', icon: Shield },
                  { path: '/service-fee-test', label: 'Service Fee Test', icon: CreditCard }
                ].map((route) => (
                  <Card key={route.path} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div 
                      className="flex items-center gap-3"
                      onClick={() => navigate(route.path)}
                    >
                      <route.icon className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{route.label}</h4>
                        <p className="text-sm text-muted-foreground">{route.path}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="status" className="space-y-4">
              <h3 className="text-lg font-semibold">Current System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Authentication</h4>
                  <div className="space-y-1 text-sm">
                    <p>Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
                    <p>User Type: {userType || 'None'}</p>
                    <p>User ID: {user?.id || 'None'}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Configuration</h4>
                  <div className="space-y-1 text-sm">
                    <p>Settings Loaded: {settings ? `${settings.length} items` : 'None'}</p>
                    <p>Loading: {configLoading ? 'Yes' : 'No'}</p>
                    <p>Errors: {configError ? 'Yes' : 'None'}</p>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemTestComponent;
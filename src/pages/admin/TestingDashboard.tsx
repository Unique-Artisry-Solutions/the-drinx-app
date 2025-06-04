
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Users,
  Database,
  Zap
} from 'lucide-react';
import TestSuite from '@/components/admin/testing/TestSuite';
import TestProgressMatrix from '@/components/admin/testing/TestProgressMatrix';
import { TestScenario } from '@/components/admin/testing/TestScenarioTracker';

// Mock data for demonstration
const PHASE_9B_SCENARIOS: TestScenario[] = [
  {
    id: 'audience-segment-creation',
    name: 'Audience Segment Creation',
    description: 'Test creation of new audience segments with various criteria',
    category: 'Audience Analytics',
    priority: 'high',
    status: 'passed',
    retryCount: 0,
    maxRetries: 3,
    duration: 2340,
    lastRun: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    requirements: [],
    expectedResults: []
  },
  {
    id: 'audience-overlap-analysis',
    name: 'Audience Overlap Analysis',
    description: 'Test overlap analysis between different audience segments',
    category: 'Audience Analytics',
    priority: 'medium',
    status: 'running',
    retryCount: 0,
    maxRetries: 3,
    requirements: [],
    expectedResults: []
  },
  {
    id: 'admin-dashboard-integration',
    name: 'Admin Dashboard Integration',
    description: 'Test integration of audience features in admin dashboard',
    category: 'Admin Integration',
    priority: 'high',
    status: 'failed',
    retryCount: 1,
    maxRetries: 3,
    duration: 1890,
    lastRun: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    requirements: [],
    expectedResults: []
  },
  {
    id: 'database-performance-audit',
    name: 'Database Performance Audit',
    description: 'Test database performance under audience analytics load',
    category: 'Database Performance',
    priority: 'medium',
    status: 'pending',
    retryCount: 0,
    maxRetries: 2,
    requirements: [],
    expectedResults: []
  }
];

const TestingDashboard: React.FC = () => {
  const [scenarios] = useState<TestScenario[]>(PHASE_9B_SCENARIOS);

  // Calculate overview statistics
  const totalTests = scenarios.length;
  const passedTests = scenarios.filter(s => s.status === 'passed').length;
  const failedTests = scenarios.filter(s => s.status === 'failed').length;
  const runningTests = scenarios.filter(s => s.status === 'running').length;
  const pendingTests = scenarios.filter(s => s.status === 'pending').length;
  const overallProgress = Math.round((passedTests / totalTests) * 100);

  const handleExportResults = (results: any) => {
    console.log('Exporting test results:', results);
    // Additional export logic can be added here
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TestTube className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Phase 9B Testing Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Medium Risk Testing - Requires Careful Validation
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            Phase 9B
          </Badge>
          <Badge 
            className={
              overallProgress >= 80 ? 'bg-green-100 text-green-800' :
              overallProgress >= 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }
          >
            {overallProgress}% Complete
          </Badge>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
              <TestTube className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{passedTests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedTests}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Running</p>
                <p className="text-2xl font-bold text-blue-600">{runningTests}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-600">{pendingTests}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test-suite">Test Suite</TabsTrigger>
          <TabsTrigger value="progress-matrix">Progress Matrix</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Testing Progress
                </CardTitle>
                <CardDescription>
                  Overall progress and category breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestProgressMatrix scenarios={scenarios} compactView={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Phase 9B Focus Areas
                </CardTitle>
                <CardDescription>
                  Key components being tested in this phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Audience Analytics</h3>
                      <p className="text-sm text-gray-600">Segmentation and overlap analysis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Database className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Admin Integration</h3>
                      <p className="text-sm text-gray-600">Dashboard integration and permissions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Zap className="h-6 w-6 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold">Performance Testing</h3>
                      <p className="text-sm text-gray-600">Database and UI performance validation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="test-suite" className="mt-6">
          <TestSuite onExportResults={handleExportResults} />
        </TabsContent>

        <TabsContent value="progress-matrix" className="mt-6">
          <TestProgressMatrix scenarios={scenarios} showTrends={true} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Reports & Documentation</CardTitle>
              <CardDescription>
                Detailed reports and documentation for Phase 9B testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Reports Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  Detailed test reports and analytics will be available here.
                </p>
                <Button variant="outline">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingDashboard;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube, 
  Users, 
  BarChart3, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import {
  TestControls,
  TestReportSection,
  TestResultsVisualization,
  TestScenarioTracker,
  TestSuite,
  TestProgressMatrix,
  AudienceAnalyticsTestSuite,
  PerformanceTestRunner,
  SegmentationTestValidator,
  type TestScenario
} from '@/components/admin/testing';

const TestingDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTests, setActiveTests] = useState<string[]>([]);

  // Mock test scenarios for TestProgressMatrix
  const mockTestScenarios: TestScenario[] = [
    {
      id: 'audience-segmentation',
      name: 'Audience Segmentation Tests',
      status: 'passed',
      progress: 100,
      description: 'Testing audience segmentation functionality',
      category: 'audience',
      lastRun: new Date().toISOString(),
      duration: 2500
    },
    {
      id: 'performance-load',
      name: 'Performance Load Tests',
      status: 'running',
      progress: 65,
      description: 'Load testing system performance',
      category: 'performance',
      lastRun: new Date().toISOString(),
      duration: 5000
    },
    {
      id: 'analytics-validation',
      name: 'Analytics Validation Tests',
      status: 'failed',
      progress: 30,
      description: 'Validating analytics data accuracy',
      category: 'analytics',
      lastRun: new Date().toISOString(),
      duration: 1800,
      error: 'Data validation failed for segment overlap metrics'
    },
    {
      id: 'relationship-mapping',
      name: 'Relationship Mapping Tests',
      status: 'pending',
      progress: 0,
      description: 'Testing audience relationship mapping',
      category: 'audience',
      lastRun: null,
      duration: 0
    }
  ];

  const testSuites = [
    {
      id: 'core-functionality',
      name: 'Core Functionality',
      description: 'Basic system functionality tests',
      testsCount: 12,
      status: 'passed' as const,
      icon: TestTube
    },
    {
      id: 'audience-analytics',
      name: 'Audience Analytics',
      description: 'Audience segmentation and analytics tests',
      testsCount: 8,
      status: 'running' as const,
      icon: Users
    },
    {
      id: 'performance',
      name: 'Performance',
      description: 'Load and performance testing',
      testsCount: 6,
      status: 'failed' as const,
      icon: BarChart3
    },
    {
      id: 'integration',
      name: 'Integration',
      description: 'Third-party integration tests',
      testsCount: 4,
      status: 'pending' as const,
      icon: Activity
    }
  ];

  const handleRunAllTests = () => {
    setIsRunning(true);
    // Simulate test execution
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'passed':
        return 'secondary' as const;
      case 'failed':
        return 'destructive' as const;
      case 'running':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive testing suite for Phase 9B features
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRunAllTests}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <PauseCircle className="h-4 w-4" />
                Running Tests...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {testSuites.map((suite) => {
          const Icon = suite.icon;
          return (
            <Card key={suite.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {suite.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{suite.testsCount}</div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(suite.status)}
                    <Badge 
                      variant={getStatusBadgeVariant(suite.status)}
                      className={suite.status === 'passed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {suite.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {suite.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Testing Interface */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TestControls />
            <TestResultsVisualization />
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TestScenarioTracker />
            <TestSuite />
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <TestProgressMatrix scenarios={mockTestScenarios} />
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AudienceAnalyticsTestSuite />
            <SegmentationTestValidator />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceTestRunner />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <TestReportSection />
        </TabsContent>
      </Tabs>

      {/* Real-time Test Status */}
      {isRunning && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Activity className="h-5 w-5 animate-spin" />
              Test Execution in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
              <p className="text-xs text-blue-600">
                Running audience analytics test suite... (2 of 4 suites completed)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestingDashboard;

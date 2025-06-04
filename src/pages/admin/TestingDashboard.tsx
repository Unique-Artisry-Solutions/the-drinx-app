
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AdminPageLayout } from '@/components/admin/layout';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface TestScenario {
  id: string;
  name: string;
  category: 'audience-analytics' | 'admin-integration' | 'performance' | 'e2e';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedDuration: number; // in minutes
  lastRun?: Date;
  error?: string;
}

const mockTestScenarios: TestScenario[] = [
  {
    id: 'aa-segment-creation',
    name: 'Audience Segment Creation',
    category: 'audience-analytics',
    status: 'pending',
    priority: 'critical',
    description: 'Test creation of new audience segments with various criteria',
    estimatedDuration: 15
  },
  {
    id: 'aa-relationship-mapping',
    name: 'Relationship Mapping Validation',
    category: 'audience-analytics', 
    status: 'pending',
    priority: 'high',
    description: 'Validate audience relationship mapping functionality',
    estimatedDuration: 20
  },
  {
    id: 'ai-navigation-flow',
    name: 'Admin Navigation Integration',
    category: 'admin-integration',
    status: 'passed',
    priority: 'medium',
    description: 'Test admin navigation flow and routing',
    estimatedDuration: 10,
    lastRun: new Date('2024-12-20T10:30:00')
  },
  {
    id: 'perf-dashboard-load',
    name: 'Dashboard Performance Load Test',
    category: 'performance',
    status: 'pending',
    priority: 'high',
    description: 'Test dashboard performance under various load conditions',
    estimatedDuration: 30
  },
  {
    id: 'e2e-full-workflow',
    name: 'End-to-End Workflow Test',
    category: 'e2e',
    status: 'running',
    priority: 'critical',
    description: 'Complete workflow from audience creation to analytics reporting',
    estimatedDuration: 45
  }
];

const TestingDashboard: React.FC = () => {
  const [scenarios, setScenarios] = useState<TestScenario[]>(mockTestScenarios);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const pageConfig = {
    title: 'Phase 9B Testing Dashboard',
    description: 'Track and manage testing progress for Phase 9B medium-risk components',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const getStatusIcon = (status: TestScenario['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'skipped':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: TestScenario['status']) => {
    switch (status) {
      case 'passed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'running':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'skipped':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: TestScenario['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredScenarios = selectedCategory === 'all' 
    ? scenarios 
    : scenarios.filter(s => s.category === selectedCategory);

  const totalTests = scenarios.length;
  const passedTests = scenarios.filter(s => s.status === 'passed').length;
  const failedTests = scenarios.filter(s => s.status === 'failed').length;
  const runningTests = scenarios.filter(s => s.status === 'running').length;
  const pendingTests = scenarios.filter(s => s.status === 'pending').length;

  const overallProgress = (passedTests / totalTests) * 100;

  const runTest = (id: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'running' as const } : s
    ));
    
    // Simulate test execution
    setTimeout(() => {
      setScenarios(prev => prev.map(s => 
        s.id === id ? { 
          ...s, 
          status: Math.random() > 0.3 ? 'passed' as const : 'failed' as const,
          lastRun: new Date(),
          error: Math.random() > 0.3 ? undefined : 'Simulated test failure'
        } : s
      ));
    }, 3000);
  };

  const resetTest = (id: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'pending' as const, error: undefined } : s
    ));
  };

  return (
    <AdminPageLayout config={pageConfig}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tests</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">{totalTests}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-green-600">{passedTests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedTests}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Running</p>
                <p className="text-2xl font-bold text-blue-600">{runningTests}</p>
              </div>
              <Play className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-gray-600">{pendingTests}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Testing Progress</CardTitle>
          <CardDescription>Phase 9B testing completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(overallProgress)}% Complete</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Test Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Test Scenarios</CardTitle>
          <CardDescription>Manage and execute Phase 9B test scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Tests</TabsTrigger>
              <TabsTrigger value="audience-analytics">Audience Analytics</TabsTrigger>
              <TabsTrigger value="admin-integration">Admin Integration</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="e2e">End-to-End</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <div className="space-y-4">
                {filteredScenarios.map((scenario) => (
                  <Card key={scenario.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(scenario.status)}
                            <h3 className="font-semibold">{scenario.name}</h3>
                            <Badge variant={getStatusBadgeVariant(scenario.status)}>
                              {scenario.status}
                            </Badge>
                            <span className={`text-sm font-medium ${getPriorityColor(scenario.priority)}`}>
                              {scenario.priority}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {scenario.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Est. Duration: {scenario.estimatedDuration}m</span>
                            {scenario.lastRun && (
                              <span>Last Run: {scenario.lastRun.toLocaleString()}</span>
                            )}
                          </div>
                          {scenario.error && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                              Error: {scenario.error}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => runTest(scenario.id)}
                            disabled={scenario.status === 'running'}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            {scenario.status === 'running' ? 'Running...' : 'Run'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => resetTest(scenario.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
};

export default TestingDashboard;

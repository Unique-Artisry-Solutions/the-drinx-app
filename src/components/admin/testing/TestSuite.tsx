
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, PauseCircle, RotateCcw, Download } from 'lucide-react';
import TestScenarioTracker, { TestScenario } from './TestScenarioTracker';
import { useToast } from '@/hooks/use-toast';

const PHASE_9B_TEST_SCENARIOS: TestScenario[] = [
  // Audience Analytics Tests
  {
    id: 'audience-segment-creation',
    name: 'Audience Segment Creation',
    description: 'Test creation of new audience segments with various criteria',
    category: 'Audience Analytics',
    priority: 'high',
    status: 'pending',
    retryCount: 0,
    maxRetries: 3,
    requirements: [
      'User has admin permissions',
      'Database connection is active',
      'Segment creation form is accessible'
    ],
    expectedResults: [
      'Segment is created successfully',
      'Segment appears in segments list',
      'Segment criteria are saved correctly'
    ]
  },
  {
    id: 'audience-overlap-analysis',
    name: 'Audience Overlap Analysis',
    description: 'Test overlap analysis between different audience segments',
    category: 'Audience Analytics',
    priority: 'medium',
    status: 'pending',
    retryCount: 0,
    maxRetries: 3,
    requirements: [
      'Multiple segments exist',
      'Analytics engine is running',
      'Sufficient data for analysis'
    ],
    expectedResults: [
      'Overlap percentages are calculated',
      'Visualization displays correctly',
      'Data updates in real-time'
    ]
  },
  {
    id: 'segment-performance-metrics',
    name: 'Segment Performance Metrics',
    description: 'Test performance tracking for audience segments',
    category: 'Audience Analytics',
    priority: 'high',
    status: 'pending',
    retryCount: 0,
    maxRetries: 3,
    requirements: [
      'Active segments with members',
      'Performance data collection enabled',
      'Metrics calculation service running'
    ],
    expectedResults: [
      'Performance metrics are accurate',
      'Charts render without errors',
      'Data refreshes automatically'
    ]
  },
  
  // Admin Integration Tests
  {
    id: 'admin-dashboard-integration',
    name: 'Admin Dashboard Integration',
    description: 'Test integration of audience features in admin dashboard',
    category: 'Admin Integration',
    priority: 'high',
    status: 'pending',
    retryCount: 0,
    maxRetries: 3,
    requirements: [
      'Admin dashboard is accessible',
      'Audience modules are loaded',
      'Navigation is properly configured'
    ],
    expectedResults: [
      'Audience sections load correctly',
      'Navigation works seamlessly',
      'Data displays accurately'
    ]
  },
  {
    id: 'permission-system-validation',
    name: 'Permission System Validation',
    description: 'Test role-based access control for audience features',
    category: 'Admin Integration',
    priority: 'high',
    status: 'pending',
    retryCount: 0,
    maxRetries: 3,
    requirements: [
      'Multiple user roles configured',
      'Permission system is active',
      'Test users with different roles'
    ],
    expectedResults: [
      'Access control works correctly',
      'Unauthorized actions are blocked',
      'Proper error messages displayed'
    ]
  },
  
  // Database Tests
  {
    id: 'database-performance-audit',
    name: 'Database Performance Audit',
    description: 'Test database performance under audience analytics load',
    category: 'Database Performance',
    priority: 'medium',
    status: 'pending',
    retryCount: 0,
    maxRetries: 2,
    requirements: [
      'Database monitoring tools enabled',
      'Sample data loaded',
      'Performance baseline established'
    ],
    expectedResults: [
      'Query response times acceptable',
      'No memory leaks detected',
      'Concurrent operations handled'
    ]
  },
  
  // UI/UX Tests
  {
    id: 'responsive-design-validation',
    name: 'Responsive Design Validation',
    description: 'Test audience analytics UI across different screen sizes',
    category: 'UI/UX',
    priority: 'medium',
    status: 'pending',
    retryCount: 0,
    maxRetries: 3,
    requirements: [
      'Multiple device viewports available',
      'UI components are responsive',
      'CSS breakpoints configured'
    ],
    expectedResults: [
      'UI adapts to screen sizes',
      'All features remain accessible',
      'No layout breaking occurs'
    ]
  }
];

export interface TestSuiteProps {
  onExportResults?: (results: any) => void;
}

export const TestSuite: React.FC<TestSuiteProps> = ({ onExportResults }) => {
  const [scenarios, setScenarios] = useState<TestScenario[]>(PHASE_9B_TEST_SCENARIOS);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const { toast } = useToast();

  const updateScenarioStatus = useCallback((id: string, status: TestScenario['status']) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id 
        ? { 
            ...scenario, 
            status, 
            lastRun: status === 'running' ? new Date() : scenario.lastRun,
            duration: status === 'passed' || status === 'failed' 
              ? Math.floor(Math.random() * 5000) + 1000 
              : scenario.duration
          }
        : scenario
    ));
  }, []);

  const retryScenario = useCallback((id: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id 
        ? { ...scenario, retryCount: scenario.retryCount + 1, status: 'pending' }
        : scenario
    ));
  }, []);

  const runScenario = useCallback(async (id: string) => {
    // Simulate test execution
    const scenario = scenarios.find(s => s.id === id);
    if (!scenario) return;

    const executionTime = Math.random() * 3000 + 1000;
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    // Random success/failure for demo
    const success = Math.random() > 0.2; // 80% success rate
    updateScenarioStatus(id, success ? 'passed' : 'failed');
    
    toast({
      title: `Test ${success ? 'Passed' : 'Failed'}`,
      description: `${scenario.name} has ${success ? 'completed successfully' : 'failed'}`,
      variant: success ? 'default' : 'destructive'
    });
  }, [scenarios, updateScenarioStatus, toast]);

  const runAllTests = async () => {
    setIsRunningAll(true);
    
    for (const scenario of scenarios) {
      if (scenario.status !== 'passed') {
        updateScenarioStatus(scenario.id, 'running');
        await runScenario(scenario.id);
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setIsRunningAll(false);
    toast({
      title: 'Test Suite Complete',
      description: 'All Phase 9B tests have been executed'
    });
  };

  const resetAllTests = () => {
    setScenarios(prev => prev.map(scenario => ({
      ...scenario,
      status: 'pending',
      retryCount: 0,
      duration: undefined,
      lastRun: undefined
    })));
    
    toast({
      title: 'Tests Reset',
      description: 'All test scenarios have been reset to pending status'
    });
  };

  const getProgressByCategory = (category: string) => {
    const categoryScenarios = scenarios.filter(s => s.category === category);
    const passed = categoryScenarios.filter(s => s.status === 'passed').length;
    return Math.round((passed / categoryScenarios.length) * 100);
  };

  const getTotalProgress = () => {
    const passed = scenarios.filter(s => s.status === 'passed').length;
    return Math.round((passed / scenarios.length) * 100);
  };

  const categories = [...new Set(scenarios.map(s => s.category))];

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      totalTests: scenarios.length,
      passed: scenarios.filter(s => s.status === 'passed').length,
      failed: scenarios.filter(s => s.status === 'failed').length,
      progress: getTotalProgress(),
      scenarios: scenarios
    };
    
    if (onExportResults) {
      onExportResults(results);
    }
    
    // Download as JSON
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phase-9b-test-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Phase 9B Test Suite Progress</CardTitle>
              <CardDescription>
                {scenarios.filter(s => s.status === 'passed').length} of {scenarios.length} tests passed
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {getTotalProgress()}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={getTotalProgress()} className="h-3 mb-4" />
          <div className="flex gap-2">
            <Button onClick={runAllTests} disabled={isRunningAll} className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              {isRunningAll ? 'Running All Tests...' : 'Run All Tests'}
            </Button>
            <Button onClick={resetAllTests} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset All
            </Button>
            <Button onClick={exportResults} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Scenarios by Category */}
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-sm">
              {category}
              <Badge variant="secondary" className="ml-2">
                {getProgressByCategory(category)}%
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="space-y-4">
              {scenarios
                .filter(scenario => scenario.category === category)
                .map(scenario => (
                  <TestScenarioTracker
                    key={scenario.id}
                    scenario={scenario}
                    onStatusChange={updateScenarioStatus}
                    onRetry={retryScenario}
                    onRun={runScenario}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TestSuite;

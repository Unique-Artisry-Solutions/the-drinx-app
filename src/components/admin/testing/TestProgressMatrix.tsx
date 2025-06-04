
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Play,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { TestScenario } from './TestScenarioTracker';

export interface TestProgressMatrixProps {
  scenarios: TestScenario[];
  showTrends?: boolean;
  compactView?: boolean;
}

export interface CategoryStats {
  category: string;
  total: number;
  passed: number;
  failed: number;
  running: number;
  pending: number;
  skipped: number;
  progress: number;
  trend: 'up' | 'down' | 'stable';
}

export const TestProgressMatrix: React.FC<TestProgressMatrixProps> = ({
  scenarios,
  showTrends = true,
  compactView = false
}) => {
  // Calculate statistics by category
  const getCategoryStats = (): CategoryStats[] => {
    const categories = [...new Set(scenarios.map(s => s.category))];
    
    return categories.map(category => {
      const categoryScenarios = scenarios.filter(s => s.category === category);
      const total = categoryScenarios.length;
      const passed = categoryScenarios.filter(s => s.status === 'passed').length;
      const failed = categoryScenarios.filter(s => s.status === 'failed').length;
      const running = categoryScenarios.filter(s => s.status === 'running').length;
      const pending = categoryScenarios.filter(s => s.status === 'pending').length;
      const skipped = categoryScenarios.filter(s => s.status === 'skipped').length;
      const progress = Math.round((passed / total) * 100);
      
      // Simple trend calculation (for demo - in real app would compare with historical data)
      const completionRate = (passed + failed) / total;
      const trend = completionRate > 0.7 ? 'up' : completionRate > 0.3 ? 'stable' : 'down';
      
      return {
        category,
        total,
        passed,
        failed,
        running,
        pending,
        skipped,
        progress,
        trend
      };
    });
  };

  const categoryStats = getCategoryStats();

  const getStatusIcon = (status: TestScenario['status'], size = 'h-4 w-4') => {
    switch (status) {
      case 'passed':
        return <CheckCircle className={`${size} text-green-600`} />;
      case 'failed':
        return <XCircle className={`${size} text-red-600`} />;
      case 'running':
        return <Clock className={`${size} text-blue-600 animate-spin`} />;
      case 'skipped':
        return <AlertTriangle className={`${size} text-yellow-600`} />;
      default:
        return <Play className={`${size} text-gray-400`} />;
    }
  };

  const getTrendIcon = (trend: CategoryStats['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: TestScenario['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (compactView) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryStats.map(stats => (
          <Card key={stats.category} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{stats.category}</h3>
              {showTrends && getTrendIcon(stats.trend)}
            </div>
            <div className="space-y-2">
              <Progress value={stats.progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-600">
                <span>{stats.passed}/{stats.total} passed</span>
                <span>{stats.progress}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Test Progress Matrix</CardTitle>
          <CardDescription>
            Visual overview of test execution progress across all categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map(stats => (
              <div key={stats.category} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{stats.category}</h3>
                    {showTrends && (
                      <div className="flex items-center gap-1">
                        {getTrendIcon(stats.trend)}
                        <span className="text-xs text-gray-500">trend</span>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">
                    {stats.progress}% complete
                  </Badge>
                </div>
                
                <Progress value={stats.progress} className="h-3 mb-3" />
                
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Passed: {stats.passed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Failed: {stats.failed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Running: {stats.running}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-gray-400" />
                    <span>Pending: {stats.pending}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span>Skipped: {stats.skipped}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Test Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Test Scenario Grid</CardTitle>
          <CardDescription>
            Detailed view of individual test scenarios and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scenarios.map(scenario => (
              <div
                key={scenario.id}
                className={`flex items-center justify-between p-3 border-l-4 ${getPriorityColor(scenario.priority)} bg-gray-50 rounded-r-lg`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(scenario.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{scenario.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {scenario.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{scenario.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  {scenario.duration && (
                    <span className="text-gray-500">{scenario.duration}ms</span>
                  )}
                  {scenario.retryCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Retry {scenario.retryCount}/{scenario.maxRetries}
                    </Badge>
                  )}
                  <Badge className={
                    scenario.status === 'passed' ? 'bg-green-100 text-green-800' :
                    scenario.status === 'failed' ? 'bg-red-100 text-red-800' :
                    scenario.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    scenario.status === 'skipped' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {scenario.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestProgressMatrix;

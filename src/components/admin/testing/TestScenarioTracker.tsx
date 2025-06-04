
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  RotateCcw 
} from 'lucide-react';

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  lastRun?: Date;
  retryCount: number;
  maxRetries: number;
  requirements: string[];
  expectedResults: string[];
}

export interface TestScenarioTrackerProps {
  scenario: TestScenario;
  onStatusChange: (id: string, status: TestScenario['status']) => void;
  onRetry: (id: string) => void;
  onRun: (id: string) => Promise<void>;
}

export const TestScenarioTracker: React.FC<TestScenarioTrackerProps> = ({
  scenario,
  onStatusChange,
  onRetry,
  onRun
}) => {
  const [isRunning, setIsRunning] = useState(false);

  const getStatusIcon = (status: TestScenario['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'skipped':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestScenario['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TestScenario['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    onStatusChange(scenario.id, 'running');
    
    try {
      await onRun(scenario.id);
    } catch (error) {
      console.error(`Test ${scenario.id} failed:`, error);
      onStatusChange(scenario.id, 'failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRetry = () => {
    if (scenario.retryCount < scenario.maxRetries) {
      onRetry(scenario.id);
      handleRun();
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(scenario.status)}
            <CardTitle className="text-lg">{scenario.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(scenario.priority)}>
              {scenario.priority}
            </Badge>
            <Badge className={getStatusColor(scenario.status)}>
              {scenario.status}
            </Badge>
          </div>
        </div>
        <CardDescription>{scenario.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Test Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Category:</span> {scenario.category}
            </div>
            <div>
              <span className="font-medium">Retries:</span> {scenario.retryCount}/{scenario.maxRetries}
            </div>
            {scenario.duration && (
              <div>
                <span className="font-medium">Duration:</span> {scenario.duration}ms
              </div>
            )}
            {scenario.lastRun && (
              <div>
                <span className="font-medium">Last Run:</span> {scenario.lastRun.toLocaleString()}
              </div>
            )}
          </div>

          {/* Requirements */}
          {scenario.requirements.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Requirements:</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {scenario.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Expected Results */}
          {scenario.expectedResults.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Expected Results:</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {scenario.expectedResults.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleRun}
              disabled={isRunning || scenario.status === 'running'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Run Test'}
            </Button>
            
            {scenario.status === 'failed' && scenario.retryCount < scenario.maxRetries && (
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
            )}
            
            {scenario.status !== 'pending' && (
              <Button
                onClick={() => onStatusChange(scenario.id, 'pending')}
                variant="outline"
                size="sm"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestScenarioTracker;

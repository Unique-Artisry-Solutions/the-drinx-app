
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ClipboardCheck, AlertTriangle } from 'lucide-react';

interface TestProgress {
  category: string;
  completed: number;
  total: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
}

const testCategories: TestProgress[] = [
  { category: 'Unit Tests', completed: 45, total: 60, status: 'in_progress' },
  { category: 'Integration Tests', completed: 28, total: 35, status: 'in_progress' },
  { category: 'E2E Tests', completed: 12, total: 20, status: 'in_progress' },
  { category: 'Performance Tests', completed: 8, total: 10, status: 'in_progress' },
  { category: 'Security Tests', completed: 15, total: 15, status: 'completed' },
];

const Phase6Testing = () => {
  const getStatusColor = (status: TestProgress['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const calculateTotalProgress = () => {
    const totalCompleted = testCategories.reduce((sum, cat) => sum + cat.completed, 0);
    const totalTests = testCategories.reduce((sum, cat) => sum + cat.total, 0);
    return Math.round((totalCompleted / totalTests) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-green-500" />
            Phase 6: Testing and Rollout
          </CardTitle>
          <Badge className={`${getStatusColor('in_progress')}`}>
            In Progress
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Overall Testing Progress</h3>
            <span className="text-sm font-medium">{calculateTotalProgress()}%</span>
          </div>
          <Progress value={calculateTotalProgress()} className="h-2" />
        </div>

        <div className="space-y-4">
          {testCategories.map((category) => (
            <TooltipProvider key={category.category}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{category.category}</span>
                        {category.completed === category.total && (
                          <Badge className="bg-green-100 text-green-800">
                            Complete
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {category.completed}/{category.total} tests
                      </span>
                    </div>
                    <Progress 
                      value={(category.completed / category.total) * 100} 
                      className="h-2"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {Math.round((category.completed / category.total) * 100)}% Complete
                    <br />
                    {category.total - category.completed} tests remaining
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Rollout Status</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Pre-release Testing</p>
                <p className="text-sm text-gray-500">
                  Currently in QA environment. Production deployment scheduled for next sprint.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase6Testing;

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
import { ClipboardCheck, AlertTriangle, Cpu, Shield, Rocket, CircleDashed, Clock, Check } from 'lucide-react';

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

const promoterTestCategories: TestProgress[] = [
  { category: 'Promoter Authentication', completed: 12, total: 12, status: 'completed' },
  { category: 'Communication System', completed: 24, total: 30, status: 'in_progress' },
  { category: 'Event Management', completed: 18, total: 40, status: 'in_progress' },
  { category: 'Analytics Reporting', completed: 5, total: 25, status: 'in_progress' },
  { category: 'Brand Partnerships', completed: 0, total: 20, status: 'not_started' },
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

  const calculateTotalProgress = (categories: TestProgress[]) => {
    const totalCompleted = categories.reduce((sum, cat) => sum + cat.completed, 0);
    const totalTests = categories.reduce((sum, cat) => sum + cat.total, 0);
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
            <h3 className="text-sm font-medium">Overall Promoter System Testing Progress</h3>
            <span className="text-sm font-medium">{calculateTotalProgress(promoterTestCategories)}%</span>
          </div>
          <Progress value={calculateTotalProgress(promoterTestCategories)} className="h-2" />
        </div>

        <div className="space-y-4">
          {promoterTestCategories.map((category) => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-4 w-4 text-slate-700" />
              <h3 className="font-medium text-sm">Performance Testing</h3>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                <div className="text-xs">Testing event system with simulated load of 10,000 concurrent users</div>
              </div>
              <div className="flex items-start gap-2">
                <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="text-xs">Database optimization for high-volume ticket sales</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-slate-700" />
              <h3 className="font-medium text-sm">Security Testing</h3>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="text-xs">Payment system security audit completed</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="text-xs">Promoter authentication penetration testing passed</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="h-4 w-4 text-slate-700" />
              <h3 className="font-medium text-sm">Rollout Plan</h3>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="text-xs">Alpha release to internal team</div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                <div className="text-xs">Beta program with select promoters in progress</div>
              </div>
              <div className="flex items-start gap-2">
                <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="text-xs">Public launch planned for Q4</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Rollout Status</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Beta Testing in Progress</p>
                <p className="text-sm text-gray-500">
                  Currently being tested with a select group of 15 promoters. Gathering feedback on communication system and event creation workflow.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-blue-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-blue-800">Launch Timeline</h4>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Alpha Testing</span>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Beta Program</span>
                <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Feature Freeze</span>
                <Badge className="bg-gray-100 text-gray-800">Sep 2025</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Public Launch</span>
                <Badge className="bg-gray-100 text-gray-800">Oct 2025</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase6Testing;

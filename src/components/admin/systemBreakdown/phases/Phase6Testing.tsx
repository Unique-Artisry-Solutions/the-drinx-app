
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck } from 'lucide-react';
import { TestProgressSection } from './components/TestProgressSection';
import { TestingStatusGrid } from './components/TestingStatusGrid';
import { RolloutTimeline } from './components/RolloutTimeline';

interface TestProgress {
  category: string;
  completed: number;
  total: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
}

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
        <TestProgressSection 
          categories={promoterTestCategories} 
          title="Overall Promoter System Testing Progress"
        />
        <TestingStatusGrid />
        <RolloutTimeline />
      </CardContent>
    </Card>
  );
};

export default Phase6Testing;

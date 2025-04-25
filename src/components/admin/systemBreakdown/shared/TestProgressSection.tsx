
import React from 'react';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export interface TestProgress {
  category: string;
  completed: number;
  total: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
}

export interface TestProgressSectionProps {
  categories: TestProgress[];
  title: string;
}

export const TestProgressSection: React.FC<TestProgressSectionProps> = ({
  categories,
  title,
}) => {
  const calculateTotalProgress = (categories: TestProgress[]) => {
    const totalCompleted = categories.reduce((sum, cat) => sum + cat.completed, 0);
    const totalTests = categories.reduce((sum, cat) => sum + cat.total, 0);
    return Math.round((totalCompleted / totalTests) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">{title}</h3>
          <span className="text-sm font-medium">{calculateTotalProgress(categories)}%</span>
        </div>
        <Progress value={calculateTotalProgress(categories)} className="h-2" />
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <TooltipProvider key={category.category}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{category.category}</span>
                      {category.completed === category.total && (
                        <Badge variant="success">
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
    </div>
  );
};

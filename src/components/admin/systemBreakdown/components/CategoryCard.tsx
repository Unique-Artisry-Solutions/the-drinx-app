
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Code, Database } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  totalFeatures: number;
  frontendPercentage: number;
  backendPercentage: number;
  completedCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  totalFeatures,
  frontendPercentage,
  backendPercentage,
  completedCount
}) => (
  <div className="border rounded-lg p-4">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <div className="text-sm text-gray-500 mb-3">
      {completedCount} of {totalFeatures} features complete
    </div>
    
    <div className="space-y-3">
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium flex items-center">
            <Code className="h-4 w-4 text-purple-500 mr-1" />
            Frontend
          </span>
          <span className="text-sm">{frontendPercentage}%</span>
        </div>
        <Progress value={frontendPercentage} className="h-2" />
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium flex items-center">
            <Database className="h-4 w-4 text-green-500 mr-1" />
            Backend
          </span>
          <span className="text-sm">{backendPercentage}%</span>
        </div>
        <Progress value={backendPercentage} className="h-2" />
      </div>
    </div>
  </div>
);

export default CategoryCard;

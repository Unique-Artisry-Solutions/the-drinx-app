
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FeatureShowcaseCategoryObject } from '../types';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: FeatureShowcaseCategoryObject;
}

// Alternative props for the categories tab
interface CategoryCardTabProps {
  title: string;
  totalFeatures: number;
  frontendPercentage: number;
  backendPercentage: number;
  completedCount: number;
}

const CategoryCard: React.FC<CategoryCardProps | CategoryCardTabProps> = (props) => {
  // Determine which type of props we're using
  const isTabProps = 'title' in props;
  
  // Create a dynamic icon component
  const IconComponent = () => {
    if (isTabProps) {
      // Default icon for tab views
      const LucideIcon = Icons.Layers;
      return <LucideIcon className="h-6 w-6 text-blue-500" />;
    } else {
      const iconName = (props.category.icon as any)?.name || 'Layers';
      const LucideIcon = (Icons as any)[iconName] || Icons.Layers;
      return <LucideIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <IconComponent />
          </div>
          <div>
            <CardTitle>{isTabProps ? props.title : props.category.name}</CardTitle>
            <CardDescription>
              {isTabProps 
                ? `${props.totalFeatures} features` 
                : `${props.category.featureCount} features`
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">
          {isTabProps 
            ? `${props.completedCount} of ${props.totalFeatures} features implemented` 
            : props.category.description
          }
        </p>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Implementation</span>
            <span className="font-medium">
              {isTabProps ? `${props.frontendPercentage}%` : `${props.category.implementationRate}%`}
            </span>
          </div>
          <Progress 
            value={isTabProps ? props.frontendPercentage : props.category.implementationRate} 
            className="h-2" 
          />
          
          {isTabProps && (
            <>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">Backend Progress</span>
                <span className="font-medium">{props.backendPercentage}%</span>
              </div>
              <Progress value={props.backendPercentage} className="h-2" />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;

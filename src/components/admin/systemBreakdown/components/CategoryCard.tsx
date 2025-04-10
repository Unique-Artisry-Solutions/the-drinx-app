
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FeatureShowcaseCategory } from '../types';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: FeatureShowcaseCategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Create a dynamic icon component
  const IconComponent = () => {
    const iconName = category.icon?.name || 'Layers';
    const LucideIcon = (Icons as any)[iconName] || Icons.Layers;
    return <LucideIcon className="h-6 w-6 text-blue-500" />;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <IconComponent />
          </div>
          <div>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>{category.featureCount} features</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{category.description}</p>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Implementation</span>
            <span className="font-medium">{category.implementationRate}%</span>
          </div>
          <Progress value={category.implementationRate} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { FeatureItem, FeatureShowcaseData } from '../types';

interface CategoryCardProps {
  category: {
    name: string;
    description: string;
    featureCount: number;
    implementationRate: number;
    features: FeatureItem[] | FeatureShowcaseData[];
    icon?: React.ReactNode;
  }
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            {category.icon || <Star className="h-5 w-5 text-blue-500" />}
          </div>
          <div>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>
              {category.featureCount} {category.featureCount === 1 ? 'feature' : 'features'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mt-2 mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Implementation Progress</span>
            <span>{category.implementationRate}%</span>
          </div>
          <Progress value={category.implementationRate} className="h-2" />
        </div>
        
        <div className="text-sm text-gray-600">
          {category.description}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;

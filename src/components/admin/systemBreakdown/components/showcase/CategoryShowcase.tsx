
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FeatureShowcaseCategoryType, FeatureShowcaseData } from '../../types';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryShowcaseProps {
  category: FeatureShowcaseCategoryType;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ category }) => {
  const [expanded, setExpanded] = useState(false);
  const displayCount = expanded ? category.features.length : Math.min(3, category.features.length);
  
  // Create a dynamic icon component
  const DynamicIcon = ({ iconName }: { iconName: string }) => {
    const LucideIcon = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || Icons.FileQuestion;
    return <LucideIcon className="h-4 w-4" />;
  };

  // Get badge color based on implementation rate
  const getBadgeColor = (rate: number) => {
    if (rate >= 75) return "bg-green-100 text-green-800";
    if (rate >= 50) return "bg-blue-100 text-blue-800";
    if (rate >= 25) return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <Badge className={getBadgeColor(category.implementationRate)}>
              {category.implementationRate}% Complete
            </Badge>
          </div>
          <span className="text-sm text-gray-500">{category.featureCount} features</span>
        </div>
        <p className="text-muted-foreground text-sm">{category.description}</p>
        <Progress value={category.implementationRate} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.features.slice(0, displayCount).map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </CardContent>
      {category.features.length > 3 && (
        <CardFooter className="pt-0 flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center"
          >
            {expanded ? (
              <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

interface FeatureCardProps {
  feature: FeatureShowcaseData;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  // Create a dynamic icon component
  const DynamicIcon = ({ iconName }: { iconName: string }) => {
    const LucideIcon = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || Icons.Star;
    return <LucideIcon className="h-4 w-4" />;
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'implemented': return "bg-green-100 text-green-800";
      case 'in_progress': return "bg-blue-100 text-blue-800";
      case 'partial': return "bg-amber-100 text-amber-800";
      case 'planned': return "bg-purple-100 text-purple-800";
      case 'blocked': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="border rounded-md p-3 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 rounded-md">
            <DynamicIcon iconName={feature.iconName} />
          </div>
          <div>
            <h4 className="text-sm font-medium">{feature.name}</h4>
            <p className="text-xs text-gray-500 truncate">{feature.userType}</p>
          </div>
        </div>
        <Badge className={getStatusColor(feature.implementationStatus)}>
          {feature.implementationStatus}
        </Badge>
      </div>
      
      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{feature.description}</p>
      
      {feature.marketingPoints && feature.marketingPoints.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-400">{feature.marketingPoints[0]}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryShowcase;

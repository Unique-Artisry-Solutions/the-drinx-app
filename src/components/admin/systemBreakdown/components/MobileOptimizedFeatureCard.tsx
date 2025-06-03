
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { FeatureItem } from '../types';

interface MobileOptimizedFeatureCardProps {
  feature: FeatureItem;
  onViewDetails?: (feature: FeatureItem) => void;
}

const MobileOptimizedFeatureCard: React.FC<MobileOptimizedFeatureCardProps> = ({
  feature,
  onViewDetails
}) => {
  const getStatusIcon = () => {
    switch (feature.status) {
      case 'implemented':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'not_started':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (feature.status) {
      case 'implemented':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_started':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate mb-1">{feature.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {feature.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 p-1 h-8 w-8"
            onClick={() => onViewDetails?.(feature)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <Badge className={`text-xs ${getStatusColor()}`}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              {feature.status.replace('_', ' ')}
            </div>
          </Badge>
          <span className="text-xs text-muted-foreground">
            {feature.implementationProgress || 0}% complete
          </span>
        </div>

        <Progress 
          value={feature.implementationProgress || 0} 
          className="h-2 mb-3"
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            Impact: <Badge variant="outline" className="text-xs">{feature.userImpact}</Badge>
          </span>
          <span className="flex items-center gap-1">
            Complexity: <Badge variant="outline" className="text-xs">{feature.complexity}</Badge>
          </span>
        </div>

        {feature.statusUpdated && (
          <div className="mt-2 pt-2 border-t">
            <Badge variant="outline" className="text-xs">
              Recently Updated
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedFeatureCard;

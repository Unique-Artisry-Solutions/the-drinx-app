
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FeatureItem } from './types';
import { mapToSimplifiedStatus } from './utils/stateMapping';

interface DevelopmentProgressDashboardProps {
  features: FeatureItem[];
}

const DevelopmentProgressDashboard: React.FC<DevelopmentProgressDashboardProps> = ({ features }) => {
  // Calculate stats using simplified states
  const totalFeatures = features.length;
  const implementedFeatures = features.filter(f => f.status === 'implemented').length;
  const inProgressFeatures = features.filter(f => f.status === 'in_progress').length;
  const notStartedFeatures = features.filter(f => f.status === 'not_started').length;

  const overallProgress = totalFeatures > 0 ? Math.round((implementedFeatures / totalFeatures) * 100) : 0;

  // Handle legacy state mapping for display purposes
  const getDisplayStatus = (feature: FeatureItem) => {
    // Map any legacy states that might still exist in data
    return mapToSimplifiedStatus(feature.status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'not_started':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Development Progress Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{implementedFeatures}</div>
              <div className="text-sm text-muted-foreground">Implemented</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{inProgressFeatures}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{notStartedFeatures}</div>
              <div className="text-sm text-muted-foreground">Not Started</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
          </div>
          
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {features.map((feature) => {
              const displayStatus = getDisplayStatus(feature);
              return (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{feature.name}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(displayStatus)}>
                      {displayStatus.replace('_', ' ')}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {feature.implementationProgress || 0}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentProgressDashboard;

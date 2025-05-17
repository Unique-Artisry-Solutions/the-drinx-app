
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeatureImplementationStatus } from './FeatureImplementationStatus';
import FeaturePhasesDisplay from './FeaturePhasesDisplay';
import { ImplementationDetailsPanel } from './ImplementationDetailsPanel';
import { FeatureItem } from '../types';

interface FeatureDetailCardProps {
  feature: FeatureItem;
  showPhases?: boolean;
  showDetails?: boolean;
}

export const FeatureDetailCard: React.FC<FeatureDetailCardProps> = ({ 
  feature,
  showPhases = true,
  showDetails = true
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{feature.name}</CardTitle>
          {feature.statusUpdated && (
            <Badge className="bg-blue-100 text-blue-800">Updated</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <FeatureImplementationStatus feature={feature} />
        
        {showPhases && (
          <FeaturePhasesDisplay feature={feature} />
        )}
        
        {showDetails && (
          <ImplementationDetailsPanel feature={feature} />
        )}
      </CardContent>
    </Card>
  );
};

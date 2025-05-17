
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FeatureItem } from '../types';

interface FeaturePhasesDisplayProps {
  feature: FeatureItem;
}

const getPhaseStatus = (phase: string, feature: FeatureItem) => {
  switch (phase) {
    case 'ui':
      return feature.status === 'implemented'
        ? 'Completed'
        : feature.status === 'in_progress'
        ? 'In Progress'
        : feature.status === 'partial'
        ? 'Partial'
        : 'Not Started';
    case 'api':
      return 'Planned';
    case 'database':
      return feature.databaseStatus === 'completed' || feature.databaseStatus === 'implemented'
        ? 'Completed'
        : feature.databaseStatus === 'in_progress'
        ? 'In Progress'
        : feature.databaseStatus === 'partial'
        ? 'Partial'
        : 'Not Started';
    case 'testing':
      return 'Planned';
    default:
      return 'Not Started';
  }
};

const FeaturePhasesDisplay = ({ feature }: FeaturePhasesDisplayProps) => {
  const phases = ['ui', 'api', 'database', 'testing'];

  return (
    <div className="flex space-x-2">
      {phases.map(phase => (
        <div key={phase} className="flex flex-col items-center">
          <Badge variant="secondary" className="text-xs">
            {phase.toUpperCase()}
          </Badge>
          <div className="text-xs mt-1">{getPhaseStatus(phase, feature)}</div>
        </div>
      ))}
    </div>
  );
};

export default FeaturePhasesDisplay;

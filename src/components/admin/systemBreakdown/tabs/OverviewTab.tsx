
import React from 'react';
import { Card } from '@/components/ui/card';
import { FeatureItem, FeatureStatus } from '../types';
import { renderStatusBadge } from '../utils/statusRenderers';

interface OverviewTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  adminFeatures, 
  establishmentFeatures, 
  individualFeatures,
  promoterFeatures
}) => {
  // Helper functions for status priority and attention labels
  const getStatusPriority = (status: FeatureStatus): number => {
    switch (status) {
      case 'blocked': return 1;
      case 'in_progress': return 2;
      case 'partial': return 3;
      case 'planned': return 4;
      case 'implemented': return 5;
      default: return 6;
    }
  };
  
  const getAttentionLabel = (status: FeatureStatus): string => {
    switch (status) {
      case 'blocked': return 'Needs immediate attention';
      case 'in_progress': return 'Currently in progress';
      case 'partial': return 'Partially implemented';
      case 'planned': return 'Scheduled for implementation';
      case 'implemented': return 'Successfully implemented';
      default: return 'Status unknown';
    }
  };

  // Get all features sorted by implementation status priority
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures]
    .sort((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status));
    
  // Get top features needing attention
  const featuresNeedingAttention = allFeatures
    .filter(f => f.status === 'blocked' || f.status === 'in_progress')
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">System Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Features Needing Attention</h3>
          {featuresNeedingAttention.length > 0 ? (
            <ul className="space-y-3">
              {featuresNeedingAttention.map(feature => (
                <li key={feature.id} className="border-b pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{getAttentionLabel(feature.status)}</p>
                    </div>
                    <div>{renderStatusBadge(feature.status)}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No features currently need attention.</p>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Feature Count by Type</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Admin Features:</span>
              <span className="font-medium">{adminFeatures.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Establishment Features:</span>
              <span className="font-medium">{establishmentFeatures.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Individual Features:</span>
              <span className="font-medium">{individualFeatures.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Promoter Features:</span>
              <span className="font-medium">{promoterFeatures.length}</span>
            </div>
            <div className="flex justify-between pt-2 border-t mt-2">
              <span>Total Features:</span>
              <span className="font-medium">{allFeatures.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;

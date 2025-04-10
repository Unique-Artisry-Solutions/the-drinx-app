
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FeatureItem } from '../types';

interface RecentFeaturesListProps {
  title: string;
  features: FeatureItem[];
}

const RecentFeaturesList: React.FC<RecentFeaturesListProps> = ({ title, features }) => (
  <div className="border rounded-lg p-4">
    <h4 className="font-medium mb-3">{title} Features</h4>
    {features.length > 0 ? (
      <ul className="space-y-2">
        {features.map(feature => (
          <li key={feature.id} className="text-sm border-b pb-2">
            <div className="font-medium">{feature.name}</div>
            <div className="flex justify-between mt-1">
              <Badge variant="outline" className="text-xs">
                {feature.status}
              </Badge>
              <span className="text-xs text-gray-500">
                DB: {feature.databaseStatus.replace('_', ' ')}
              </span>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-sm text-gray-500">No recent updates</div>
    )}
  </div>
);

export default RecentFeaturesList;

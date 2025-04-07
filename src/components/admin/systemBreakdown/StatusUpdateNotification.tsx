
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface StatusUpdateNotificationProps {
  updatedFeaturesCount: number;
  newCompletedFeatures?: string[];
}

const StatusUpdateNotification: React.FC<StatusUpdateNotificationProps> = ({
  updatedFeaturesCount,
  newCompletedFeatures = []
}) => {
  if (updatedFeaturesCount === 0 && newCompletedFeatures.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-center">
      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
      <div>
        <span>
          <strong>{updatedFeaturesCount}</strong> feature{updatedFeaturesCount !== 1 ? 's' : ''} {updatedFeaturesCount !== 1 ? 'have' : 'has'} been updated based on database implementation status.
        </span>
        
        {newCompletedFeatures.length > 0 && (
          <div className="mt-1 text-sm">
            <strong>Newly completed:</strong> {newCompletedFeatures.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusUpdateNotification;

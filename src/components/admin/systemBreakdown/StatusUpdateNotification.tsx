
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface StatusUpdateNotificationProps {
  updatedFeaturesCount: number;
}

const StatusUpdateNotification: React.FC<StatusUpdateNotificationProps> = ({
  updatedFeaturesCount
}) => {
  if (updatedFeaturesCount === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-center">
      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
      <span>
        <strong>{updatedFeaturesCount}</strong> feature{updatedFeaturesCount !== 1 ? 's' : ''} {updatedFeaturesCount !== 1 ? 'have' : 'has'} been updated based on database implementation status.
      </span>
    </div>
  );
};

export default StatusUpdateNotification;

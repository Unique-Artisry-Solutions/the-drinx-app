
import React from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusUpdateNotificationProps {
  updatedFeaturesCount: number;
}

export const StatusUpdateNotification: React.FC<StatusUpdateNotificationProps> = ({
  updatedFeaturesCount
}) => {
  if (updatedFeaturesCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
      <Bell className="h-4 w-4 text-blue-600" />
      <span className="text-sm text-blue-700">
        {updatedFeaturesCount} feature{updatedFeaturesCount !== 1 ? 's' : ''} updated
      </span>
      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
        {updatedFeaturesCount}
      </Badge>
    </div>
  );
};

export default StatusUpdateNotification;

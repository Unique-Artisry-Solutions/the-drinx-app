
import React from 'react';
import { MapPin, CheckCircle2 } from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
  address?: string;
}

interface StopInfoProps {
  type: 'current' | 'next';
  stop: Establishment | null;
  isLastStop?: boolean;
}

const StopInfo: React.FC<StopInfoProps> = ({ type, stop, isLastStop }) => {
  if (!stop && type === 'next') {
    return (
      <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-900/20 flex items-center">
        <span className="text-xs text-gray-600 dark:text-gray-400">You've reached the last stop!</span>
      </div>
    );
  }
  
  if (!stop) return null;
  
  const isCurrent = type === 'current';
  const bgClass = isCurrent 
    ? "bg-green-50 dark:bg-green-900/20" 
    : "bg-amber-50 dark:bg-amber-900/20";
  
  const IconComponent = isCurrent ? CheckCircle2 : MapPin;
  const iconColorClass = isCurrent
    ? "text-green-600 dark:text-green-500"
    : "text-amber-600 dark:text-amber-500";
  
  return (
    <div className={`p-2 border rounded-md ${bgClass} flex items-start shadow-sm`}>
      <IconComponent className={`h-4 w-4 mr-2 ${iconColorClass} flex-shrink-0 mt-0.5`} />
      <div>
        <div className="font-medium text-sm">{stop.name}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
          <MapPin className="h-2 w-2 mr-1" />
          {stop.address || 'Address not available'}
        </div>
      </div>
    </div>
  );
};

export default StopInfo;


import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StatusProgressBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
  icon: React.ReactNode;
  tooltip?: string;
}

const StatusProgressBar: React.FC<StatusProgressBarProps> = ({ 
  label, 
  count, 
  total, 
  color, 
  icon,
  tooltip
}) => {
  const percentage = Math.round((count / total) * 100);
  const formattedPercentage = percentage.toString().padStart(2, '0');
  
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <div className="flex items-center">
          <span className="mr-2">{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm font-medium">{count}/{total} ({formattedPercentage}%)</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip || `${count} out of ${total} features are ${label.toLowerCase()}`}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="h-2.5 w-full bg-gray-200 rounded-full">
        <div 
          className={`${color} h-2.5 rounded-full transition-all duration-500 ease-in-out`} 
          style={{ width: `${percentage}%` }}
        >
          {percentage >= 10 && (
            <div className="relative">
              <div className="absolute top-0 right-1 -translate-y-6 text-xs font-semibold">
                {formattedPercentage}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusProgressBar;

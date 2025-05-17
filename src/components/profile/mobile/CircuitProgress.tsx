
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface CircuitProgressProps {
  name: string;
  theme?: string;
  currentStopIndex: number;
  totalStops: number;
}

const CircuitProgress: React.FC<CircuitProgressProps> = ({
  name,
  theme,
  currentStopIndex,
  totalStops
}) => {
  // Calculate progress percentage
  const progressPercentage = totalStops > 0 
    ? Math.min(100, Math.round((currentStopIndex / (totalStops - 1)) * 100))
    : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h4 className="font-medium">{name}</h4>
          {theme && (
            <div className="text-xs text-muted-foreground">{theme}</div>
          )}
        </div>
        <div className="text-sm font-medium">
          {progressPercentage}%
        </div>
      </div>
      
      <Progress
        value={progressPercentage}
        className="h-2"
      />
      
      <div className="mt-2 text-xs text-muted-foreground text-center">
        {currentStopIndex} of {totalStops - 1} stops completed
      </div>
    </div>
  );
};

export default CircuitProgress;

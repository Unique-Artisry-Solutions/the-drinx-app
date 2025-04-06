
import React from 'react';
import { Badge } from '@/components/ui/badge';
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
  const progress = (currentStopIndex / totalStops) * 100;
  
  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm">{name || 'Untitled Swig Circuit'}</h3>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {theme && (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
            {theme}
          </Badge>
        )}
        <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
          {totalStops} Stops
        </Badge>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span className="font-medium">{currentStopIndex}/{totalStops} stops</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </>
  );
};

export default CircuitProgress;

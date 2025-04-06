
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';

interface CircuitActionsProps {
  circuitId: string;
  hasNextStop: boolean;
  canCheckIn: boolean;
  formatTimeRemaining: () => string;
  onCheckIn: () => void;
}

const CircuitActions: React.FC<CircuitActionsProps> = ({
  circuitId,
  hasNextStop,
  canCheckIn,
  formatTimeRemaining,
  onCheckIn
}) => {
  if (!hasNextStop) return null;

  return (
    <div className="mt-3">
      {!canCheckIn && (
        <div className="mb-2 p-2 bg-amber-50 dark:bg-amber-900/20 text-xs border border-amber-200 rounded flex items-center shadow-sm">
          <Timer className="h-3 w-3 mr-1 text-amber-600" />
          <span>Cooldown: {formatTimeRemaining()}</span>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button 
          onClick={onCheckIn} 
          disabled={!canCheckIn}
          className="flex-1 text-xs py-1 px-2 h-auto bg-spiritless-pink hover:bg-spiritless-pink/90"
          size="sm"
        >
          {canCheckIn ? 'Check In' : 'Waiting...'}
        </Button>
        
        <Button asChild variant="outline" size="sm" className="text-xs py-1 px-2 h-auto">
          <Link to={`/bar-crawl-details/${circuitId}`}>
            Details
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CircuitActions;

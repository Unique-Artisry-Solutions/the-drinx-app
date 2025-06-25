
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { checkInService, CheckInContext } from '@/services/checkInService';

interface CircuitActionsProps {
  circuitId: string;
  establishmentId?: string;
  establishmentName?: string;
  hasNextStop: boolean;
  canCheckIn: boolean;
  formatTimeRemaining: () => string;
  onCheckIn: () => void;
}

const CircuitActions: React.FC<CircuitActionsProps> = ({
  circuitId,
  establishmentId,
  establishmentName,
  hasNextStop,
  canCheckIn,
  formatTimeRemaining,
  onCheckIn
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckingIn, setIsCheckingIn] = React.useState(false);
  
  const handleCheckIn = async () => {
    if (!hasNextStop || !canCheckIn || !establishmentId || !establishmentName || !user) return;
    
    setIsCheckingIn(true);
    try {
      const context: CheckInContext = {
        type: 'swig_circuit',
        entityId: circuitId,
        entityName: `Swig Circuit at ${establishmentName}`,
        additionalData: {
          establishment_id: establishmentId,
          establishment_name: establishmentName
        }
      };

      const result = await checkInService.performCheckIn(user.id, context);
      
      if (result.success) {
        toast({
          title: "Check-in successful!",
          description: result.message,
        });
        onCheckIn();
      } else {
        toast({
          title: "Check-in failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error checking in:', error);
      toast({
        title: "Check-in failed",
        description: error.message || "Failed to check in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingIn(false);
    }
  };
  
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
          onClick={handleCheckIn} 
          disabled={!canCheckIn || isCheckingIn}
          className="flex-1 text-xs py-1 px-2 h-auto bg-spiritless-pink hover:bg-spiritless-pink/90"
          size="sm"
        >
          {isCheckingIn ? 'Checking in...' : canCheckIn ? 'Check In' : 'Waiting...'}
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

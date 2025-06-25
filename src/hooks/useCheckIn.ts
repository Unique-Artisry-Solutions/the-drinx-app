
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { checkInService, CheckInContext } from '@/services/checkInService';

interface CheckInOptions {
  barCrawlId: string;
  establishmentId: string;
  establishmentName: string;
}

export function useCheckIn() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const performCheckIn = async ({ barCrawlId, establishmentId, establishmentName }: CheckInOptions) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to check in at this establishment",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsCheckingIn(true);

      const context: CheckInContext = {
        type: 'bar_crawl',
        entityId: barCrawlId,
        entityName: `Bar Crawl at ${establishmentName}`,
        additionalData: {
          establishment_id: establishmentId,
          establishment_name: establishmentName
        }
      };

      const result = await checkInService.performCheckIn(user.id, context);

      if (result.success) {
        // Save last check-in time to local storage for cooldown
        localStorage.setItem('last_check_in_time', new Date().toISOString());
        localStorage.setItem('last_checked_in_establishment', establishmentId);
        
        toast({
          title: "Check-in successful!",
          description: result.message,
        });
        
        return true;
      } else {
        toast({
          title: "Check-in failed",
          description: result.message,
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Error checking in:', error);
      toast({
        title: "Check-in failed",
        description: error.message || "Failed to record your check-in. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCheckingIn(false);
    }
  };

  return {
    isCheckingIn,
    performCheckIn
  };
}

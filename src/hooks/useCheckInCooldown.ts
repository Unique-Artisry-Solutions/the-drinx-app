
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseCheckInCooldownProps {
  lastCheckInTime: Date | null;
}

export const useCheckInCooldown = ({ lastCheckInTime }: UseCheckInCooldownProps) => {
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();
  
  // Cooldown period in milliseconds (20 minutes)
  const COOLDOWN_PERIOD = 20 * 60 * 1000;
  
  useEffect(() => {
    if (!lastCheckInTime) {
      setCanCheckIn(true);
      setTimeRemaining(0);
      return;
    }
    
    const checkCooldown = () => {
      const now = new Date();
      const timeSinceLastCheckIn = now.getTime() - lastCheckInTime.getTime();
      
      if (timeSinceLastCheckIn < COOLDOWN_PERIOD) {
        setCanCheckIn(false);
        const remaining = Math.ceil((COOLDOWN_PERIOD - timeSinceLastCheckIn) / 1000);
        setTimeRemaining(remaining);
      } else {
        setCanCheckIn(true);
        setTimeRemaining(0);
      }
    };
    
    // Initial check
    checkCooldown();
    
    // Set up timer to update remaining time
    const timer = setInterval(() => {
      checkCooldown();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lastCheckInTime]);

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const attemptCheckIn = (establishmentId: string, establishmentName: string) => {
    if (canCheckIn) {
      // Save the current time as the last check-in time
      const now = new Date();
      localStorage.setItem('last_check_in_time', now.toISOString());
      localStorage.setItem('last_checked_in_establishment', establishmentId);
      
      toast({
        title: 'Check-in Successful',
        description: `You've checked in to ${establishmentName}.`,
      });
      
      return true;
    } else {
      toast({
        title: 'Check-in Failed',
        description: `Please wait ${formatTimeRemaining()} before checking in again.`,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  return {
    canCheckIn,
    timeRemaining,
    formatTimeRemaining,
    attemptCheckIn
  };
};

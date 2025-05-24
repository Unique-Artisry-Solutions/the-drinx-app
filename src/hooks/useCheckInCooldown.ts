
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseCheckInCooldownProps {
  lastCheckInTime: Date | null;
  cooldownDuration?: number; // in minutes
}

export function useCheckInCooldown({ 
  lastCheckInTime, 
  cooldownDuration = 5 
}: UseCheckInCooldownProps) {
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();

  // Calculate time left in cooldown period
  useEffect(() => {
    if (!lastCheckInTime) {
      setCanCheckIn(true);
      return;
    }

    const checkCooldown = () => {
      const now = new Date();
      const cooldownMs = cooldownDuration * 60 * 1000;
      const nextAvailableTime = new Date(lastCheckInTime.getTime() + cooldownMs);
      
      if (now < nextAvailableTime) {
        // Still in cooldown
        const timeLeftMs = nextAvailableTime.getTime() - now.getTime();
        setTimeRemaining(Math.ceil(timeLeftMs / 1000));
        setCanCheckIn(false);
      } else {
        // Cooldown expired
        setCanCheckIn(true);
        setTimeRemaining(0);
      }
    };

    // Check immediately
    checkCooldown();
    
    // Then set up interval to update
    const intervalId = setInterval(checkCooldown, 1000);
    
    return () => clearInterval(intervalId);
  }, [lastCheckInTime, cooldownDuration]);

  // Format time remaining into minutes:seconds
  const formatTimeRemaining = useCallback(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  // Function to attempt a check-in (returns boolean to indicate success/failure)
  const attemptCheckIn = useCallback((establishmentId: string, establishmentName: string) => {
    if (!canCheckIn) {
      toast({
        title: "Cooldown Period",
        description: `Please wait ${formatTimeRemaining()} before checking in again`,
        variant: "destructive",
      });
      return false;
    }
    
    // Cooldown is good, record the new check-in time
    localStorage.setItem('last_check_in_time', new Date().toISOString());
    localStorage.setItem('last_checked_in_establishment', establishmentId);
    
    toast({
      title: "Checked In!",
      description: `You've checked in at ${establishmentName}`,
    });
    
    return true;
  }, [canCheckIn, formatTimeRemaining, toast]);

  return {
    canCheckIn,
    timeRemaining,
    formatTimeRemaining,
    attemptCheckIn
  };
}

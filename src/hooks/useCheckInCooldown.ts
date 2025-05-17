
import { useState, useEffect, useCallback } from 'react';

interface UseCheckInCooldownProps {
  lastCheckInTime: Date | null;
  cooldownMinutes?: number; // Time in minutes before next check-in
}

export const useCheckInCooldown = ({ 
  lastCheckInTime, 
  cooldownMinutes = 30 
}: UseCheckInCooldownProps) => {
  const [canCheckIn, setCanCheckIn] = useState<boolean>(true);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  // Calculate if enough time has passed since last check-in
  const calculateCooldown = useCallback(() => {
    if (!lastCheckInTime) {
      setCanCheckIn(true);
      setRemainingTime(0);
      return;
    }
    
    const now = new Date();
    const lastCheck = new Date(lastCheckInTime);
    
    // Calculate time difference in milliseconds
    const timeDiff = now.getTime() - lastCheck.getTime();
    
    // Convert cooldown minutes to milliseconds
    const cooldownMs = cooldownMinutes * 60 * 1000;
    
    if (timeDiff < cooldownMs) {
      // Still in cooldown period
      setCanCheckIn(false);
      setRemainingTime(Math.ceil((cooldownMs - timeDiff) / 1000)); // remaining seconds
    } else {
      // Cooldown period has ended
      setCanCheckIn(true);
      setRemainingTime(0);
    }
  }, [lastCheckInTime, cooldownMinutes]);
  
  // Format the remaining time as mm:ss
  const formatTimeRemaining = useCallback(() => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }, [remainingTime]);
  
  // Set up a timer to count down and update state
  useEffect(() => {
    calculateCooldown();
    
    // If we're in cooldown period, start countdown
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanCheckIn(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [lastCheckInTime, calculateCooldown, remainingTime]);

  const attemptCheckIn = useCallback(() => {
    if (!canCheckIn) return false;
    return true;
  }, [canCheckIn]);
  
  return {
    canCheckIn,
    remainingTime,
    formatTimeRemaining,
    attemptCheckIn
  };
};

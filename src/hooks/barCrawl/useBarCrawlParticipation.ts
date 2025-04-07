
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useBarCrawlStatus } from './useBarCrawlStatus';
import { useBarCrawlJoin } from './useBarCrawlJoin';
import { useBarCrawlLeave } from './useBarCrawlLeave';
import { UseBarCrawlParticipationProps } from './types';

/**
 * Hook for managing user participation in a bar crawl (Swig Circuit).
 * Combines status checking, joining, and leaving functionality.
 * 
 * @param props - The hook properties
 * @returns Object containing participation state and functions
 */
export const useBarCrawlParticipation = ({ barCrawlId }: UseBarCrawlParticipationProps) => {
  const { user } = useAuth();
  const [operationError, setOperationError] = useState<string | null>(null);
  
  // Use the status checking hook
  const { 
    isCheckingStatus, 
    isJoined, 
    error: statusError 
  } = useBarCrawlStatus({ 
    barCrawlId, 
    user 
  });
  
  // Use the join hook
  const { 
    isLoading: isJoining, 
    error: joinError, 
    handleJoin 
  } = useBarCrawlJoin({ 
    barCrawlId, 
    user, 
    onSuccess: () => { } // Handled by status check
  });
  
  // Use the leave hook
  const { 
    isLoading: isLeaving, 
    error: leaveError, 
    handleLeave 
  } = useBarCrawlLeave({ 
    barCrawlId, 
    user, 
    onSuccess: () => { } // Handled by status check
  });

  // Combine loading states
  const isLoading = isJoining || isLeaving;
  
  // Combine error states
  const error = operationError || statusError || joinError || leaveError;
  
  return {
    isLoading,          // Whether a join/leave operation is in progress
    isCheckingStatus,   // Whether the initial status check is in progress
    isJoined,           // Whether the user has joined this bar crawl
    error,              // Any error that occurred during operations
    handleJoin,         // Function to join the bar crawl
    handleLeave,        // Function to leave the bar crawl
  };
};

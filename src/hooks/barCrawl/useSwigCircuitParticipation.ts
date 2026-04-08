
import { useAuth } from '@/contexts/auth';
import { useSwigCircuitStatus } from './useSwigCircuitStatus';
import { useSwigCircuitJoin } from './useSwigCircuitJoin';
import { useSwigCircuitLeave } from './useSwigCircuitLeave';
import { UseSwigCircuitParticipationProps } from './types';

/**
 * Combined hook for managing bar crawl participation.
 * Provides status checking, joining, and leaving functionality.
 */
export const useSwigCircuitParticipation = ({ swigCircuitId }: UseSwigCircuitParticipationProps) => {
  const { user } = useAuth();
  
  // Status check
  const { 
    isCheckingStatus, 
    isJoined, 
    error: statusError 
  } = useSwigCircuitStatus({ swigCircuitId, user });
  
  // Join functionality
  const { 
    isLoading: isJoining, 
    error: joinError, 
    handleJoin 
  } = useSwigCircuitJoin({ 
    swigCircuitId, 
    user, 
    onSuccess: () => {
      // Refresh status by calling the status hook again
      window.location.reload(); // Simple refresh for now
    }
  });
  
  // Leave functionality
  const { 
    isLoading: isLeaving, 
    error: leaveError, 
    handleLeave 
  } = useSwigCircuitLeave({ 
    swigCircuitId, 
    user, 
    onSuccess: () => {
      // Refresh status by calling the status hook again
      window.location.reload(); // Simple refresh for now
    }
  });

  const isLoading = isJoining || isLeaving;
  const error = statusError || joinError || leaveError;

  return {
    isLoading,
    isCheckingStatus,
    isJoined,
    error,
    handleJoin,
    handleLeave
  };
};

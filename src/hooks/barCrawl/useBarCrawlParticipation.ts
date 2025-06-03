
import { useAuth } from '@/contexts/auth';
import { useBarCrawlStatus } from './useBarCrawlStatus';
import { useBarCrawlJoin } from './useBarCrawlJoin';
import { useBarCrawlLeave } from './useBarCrawlLeave';
import { UseBarCrawlParticipationProps } from './types';

/**
 * Combined hook for managing bar crawl participation.
 * Provides status checking, joining, and leaving functionality.
 */
export const useBarCrawlParticipation = ({ barCrawlId }: UseBarCrawlParticipationProps) => {
  const { user } = useAuth();
  
  // Status check
  const { 
    isCheckingStatus, 
    isJoined, 
    error: statusError 
  } = useBarCrawlStatus({ barCrawlId, user });
  
  // Join functionality
  const { 
    isLoading: isJoining, 
    error: joinError, 
    handleJoin 
  } = useBarCrawlJoin({ 
    barCrawlId, 
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
  } = useBarCrawlLeave({ 
    barCrawlId, 
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

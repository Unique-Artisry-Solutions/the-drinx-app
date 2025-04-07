
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBarCrawlParticipation } from '@/hooks/useBarCrawlParticipation';
import { Loader2 } from 'lucide-react';

interface JoinBarCrawlButtonProps {
  /** The unique identifier for the bar crawl */
  barCrawlId: string;
  /** Optional CSS class name for styling the button */
  className?: string;
}

/**
 * Button component for joining or leaving a bar crawl (Swig Circuit).
 * Shows different states based on current participation status.
 */
const JoinBarCrawlButton: React.FC<JoinBarCrawlButtonProps> = ({ barCrawlId, className }) => {
  const { 
    isLoading, 
    isCheckingStatus,
    isJoined, 
    error,
    handleJoin, 
    handleLeave 
  } = useBarCrawlParticipation({
    barCrawlId
  });

  // If there was an error checking the status, show error state but still allow interaction
  const showErrorState = error && !isLoading && !isCheckingStatus;
  
  // Determine loading state message based on current action
  const loadingMessage = isCheckingStatus 
    ? 'Checking...' 
    : (isJoined ? 'Leaving...' : 'Joining...');

  return (
    <Button 
      onClick={isJoined ? handleLeave : handleJoin} 
      disabled={isLoading || isCheckingStatus}
      variant={showErrorState ? "destructive" : (isJoined ? "outline" : "default")}
      className={className}
    >
      {(isLoading || isCheckingStatus) && (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      )}
      
      {isLoading || isCheckingStatus
        ? loadingMessage
        : (isJoined ? 'Leave Swig Circuit' : 'Join Swig Circuit')
      }
    </Button>
  );
};

export default JoinBarCrawlButton;

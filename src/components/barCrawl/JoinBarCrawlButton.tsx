import React from 'react';
import { Button } from '@/components/ui/button';
import { useBarCrawlParticipation } from '@/hooks/barCrawl/useBarCrawlParticipation';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JoinBarCrawlButtonProps {
  /** The unique identifier for the bar crawl */
  barCrawlId: string;
  /** Optional CSS class name for styling the button */
  className?: string;
}

/**
 * Button component for joining or leaving a bar crawl (Swig Circuit).
 * Shows different states based on current participation status and displays error messages.
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

  const onButtonClick = () => {
    if (isJoined) {
      handleLeave(barCrawlId);
    } else {
      handleJoin();
    }
  };

  return (
    <div className="w-full">
      <Button 
        onClick={onButtonClick} 
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
      
      {/* Display error messages below the button */}
      {showErrorState && (
        <Alert variant="destructive" className="mt-2 py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs ml-2">
            {error.includes("Invalid")
              ? "Invalid bar crawl ID format"
              : error.includes("unique constraint") 
                ? "You've already joined this circuit"
                : error.includes("sign in") 
                  ? "Please sign in to join"
                  : error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default JoinBarCrawlButton;

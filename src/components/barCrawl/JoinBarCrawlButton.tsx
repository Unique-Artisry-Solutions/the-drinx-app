
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBarCrawlParticipation } from '@/hooks/useBarCrawlParticipation';

interface JoinBarCrawlButtonProps {
  barCrawlId: string;
  className?: string;
}

const JoinBarCrawlButton: React.FC<JoinBarCrawlButtonProps> = ({ barCrawlId, className }) => {
  const { isLoading, isJoined, handleJoin, handleLeave } = useBarCrawlParticipation({
    barCrawlId
  });

  return (
    <Button 
      onClick={isJoined ? handleLeave : handleJoin} 
      disabled={isLoading}
      variant={isJoined ? "outline" : "default"}
      className={className}
    >
      {isLoading 
        ? (isJoined ? 'Leaving...' : 'Joining...') 
        : (isJoined ? 'Leave Swig Circuit' : 'Join Swig Circuit')}
    </Button>
  );
};

export default JoinBarCrawlButton;

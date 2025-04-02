
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth';
import { format } from 'date-fns';

interface JoinBarCrawlButtonProps {
  barCrawlId: string;
  className?: string;
}

const JoinBarCrawlButton: React.FC<JoinBarCrawlButtonProps> = ({
  barCrawlId,
  className
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const [canJoin, setCanJoin] = useState(true);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState(false);
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState<string>('');
  const [barCrawlDetails, setBarCrawlDetails] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // For sample data functionality in current route
  const isNumericId = !isNaN(Number(barCrawlId));

  // Fetch bar crawl details and check if user can join
  useEffect(() => {
    if (user && barCrawlId) {
      const fetchBarCrawlInfo = async () => {
        try {
          // For sample data handling in demo mode
          if (isNumericId) {
            // This is just for demo purposes with sample data
            setCanJoin(true);
            return;
          }
          
          // Fetch bar crawl details
          const { data: barCrawl, error: barCrawlError } = await supabaseClient
            .from('bar_crawls')
            .select('*')
            .eq('id', barCrawlId)
            .single();

          if (barCrawlError) throw barCrawlError;
          
          setBarCrawlDetails(barCrawl);

          // Check if user has already joined this specific bar crawl
          const { data: existingParticipation, error: participationError } = await supabaseClient
            .from('user_bar_crawl_participation')
            .select('*')
            .eq('user_id', user.id)
            .eq('bar_crawl_id', barCrawlId)
            .maybeSingle();

          if (existingParticipation) {
            setIsAlreadyJoined(true);
            return;
          }

          // Check cooldown function to see if user can join a new bar crawl
          const { data: canJoinResult, error: canJoinError } = await supabaseClient.rpc(
            'can_join_bar_crawl',
            { user_id: user.id }
          );

          if (canJoinError) {
            console.error('Error checking if user can join bar crawl:', canJoinError);
            return;
          }

          setCanJoin(canJoinResult);

          // If they can't join, get their most recent bar crawl to calculate cooldown
          if (!canJoinResult) {
            const { data: lastParticipation, error: lastParticipationError } = await supabaseClient
              .from('user_bar_crawl_participation')
              .select('joined_at')
              .eq('user_id', user.id)
              .order('joined_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (lastParticipation && lastParticipation.joined_at) {
              // Calculate remaining time in the 12-hour cooldown
              const joinedAt = new Date(lastParticipation.joined_at);
              const cooldownEnds = new Date(joinedAt.getTime() + (12 * 60 * 60 * 1000)); // 12 hours in ms
              const now = new Date();
              const remainingMs = cooldownEnds.getTime() - now.getTime();
              
              if (remainingMs > 0) {
                const hours = Math.floor(remainingMs / (60 * 60 * 1000));
                const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
                setCooldownTimeRemaining(`${hours}h ${minutes}m`);
              }
            }
          }
        } catch (error) {
          console.error('Error checking participation:', error);
        }
      };

      fetchBarCrawlInfo();
    }
  }, [user, barCrawlId]);

  const handleJoin = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join this bar crawl",
        variant: "destructive",
      });
      return;
    }

    if (!barCrawlId) {
      toast({
        title: "Error",
        description: "Bar crawl ID is missing",
        variant: "destructive",
      });
      return;
    }

    if (!canJoin && !isAlreadyJoined) {
      toast({
        title: "Participation limit reached",
        description: `You can only join one bar crawl every 12 hours. Please try again in ${cooldownTimeRemaining}.`,
        variant: "destructive",
      });
      return;
    }

    if (isAlreadyJoined) {
      toast({
        title: "Already participating",
        description: "You are already participating in this bar crawl",
      });
      return;
    }

    setIsJoining(true);

    try {
      // For sample data handling in demo mode
      if (isNumericId) {
        // Simulate joining for sample data
        setTimeout(() => {
          setIsAlreadyJoined(true);
          toast({
            title: "Successfully joined!",
            description: "You've been added to this bar crawl",
          });
          setIsJoining(false);
        }, 500);
        return;
      }

      // Insert into the participation table
      const { error } = await supabaseClient
        .from('user_bar_crawl_participation')
        .insert({
          user_id: user.id,
          bar_crawl_id: barCrawlId,
        });

      if (error) {
        throw error;
      }

      setIsAlreadyJoined(true);
      toast({
        title: "Successfully joined!",
        description: "You've been added to this bar crawl",
      });
    } catch (error: any) {
      console.error('Error joining bar crawl:', error);
      toast({
        title: "Failed to join",
        description: error.message || "An error occurred while trying to join the bar crawl",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Helper to display bar crawl duration information
  const getBarCrawlDuration = () => {
    if (!barCrawlDetails || !barCrawlDetails.start_date) return null;
    
    try {
      const startDate = new Date(barCrawlDetails.start_date);
      let endDate;
      
      if (barCrawlDetails.end_date) {
        endDate = new Date(barCrawlDetails.end_date);
      } else {
        // Default 7 day duration if no end date specified
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
      }
      
      return {
        startDisplay: format(startDate, 'MMM d, yyyy'),
        endDisplay: format(endDate, 'MMM d, yyyy'),
        durationDays: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      };
    } catch (err) {
      console.error('Error calculating bar crawl duration:', err);
      return null;
    }
  };

  const duration = getBarCrawlDuration();

  return (
    <div className="vibrant-bg p-4 rounded-lg">
      <Button 
        onClick={handleJoin}
        disabled={isJoining || (!canJoin && !isAlreadyJoined) || isAlreadyJoined}
        variant="gradient"
        className={`w-full shadow-md hover:shadow-lg ${className}`}
      >
        {isAlreadyJoined 
          ? "Already Joined!" 
          : isJoining 
            ? "Joining..." 
            : "Join Bar Crawl"}
      </Button>
      
      {!canJoin && !isAlreadyJoined && (
        <Alert className="mt-3 border-destructive/50 bg-destructive/10" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You can only join one bar crawl every 12 hours. Please try again in {cooldownTimeRemaining}.
          </AlertDescription>
        </Alert>
      )}
      
      {isAlreadyJoined && (
        <Alert className="mt-3 border-spiritless-green border-2 bg-spiritless-green/10" variant="default">
          <AlertDescription className="text-spiritless-green font-medium">
            You're already participating in this bar crawl. Enjoy the experience!
          </AlertDescription>
        </Alert>
      )}

      {barCrawlDetails && barCrawlDetails.start_date && duration && (
        <Alert className="mt-3 border-spiritless-orange/50 bg-spiritless-orange/10">
          <Clock className="h-4 w-4 mr-2 text-spiritless-orange" />
          <AlertDescription className="text-spiritless-orange-dark">
            This bar crawl runs from <span className="font-medium">{duration.startDisplay}</span> to <span className="font-medium">{duration.endDisplay}</span> ({duration.durationDays} days).
            {duration.durationDays > 7 && <span className="block text-amber-600 mt-1">Note: This bar crawl has already been extended and cannot be extended further.</span>}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default JoinBarCrawlButton;

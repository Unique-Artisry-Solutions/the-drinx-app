
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, UsersRound, Building, MapPin, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';

interface BarCrawlProfileHeaderProps {
  name: string;
  participants: number;
  date: string;
  stops: number;
  id: string;
}

const BarCrawlProfileHeader: React.FC<BarCrawlProfileHeaderProps> = ({
  name,
  participants,
  date,
  stops,
  id
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const [canJoin, setCanJoin] = useState(true);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState(false);
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user can join the bar crawl
  useEffect(() => {
    if (user && id) {
      const checkParticipation = async () => {
        try {
          // Check if user has already joined this specific bar crawl
          const { data: existingParticipation } = await supabase
            .from('user_bar_crawl_participation')
            .select('*')
            .eq('user_id', user.id)
            .eq('bar_crawl_id', id)
            .single();

          if (existingParticipation) {
            setIsAlreadyJoined(true);
            return;
          }

          // Check cooldown function to see if user can join a new bar crawl
          const { data: canJoinResult, error: canJoinError } = await supabase.rpc(
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
            const { data: lastParticipation } = await supabase
              .from('user_bar_crawl_participation')
              .select('joined_at')
              .eq('user_id', user.id)
              .order('joined_at', { ascending: false })
              .limit(1)
              .single();

            if (lastParticipation) {
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

      checkParticipation();
    }
  }, [user, id]);

  const handleJoin = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join this bar crawl",
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
      // Insert into the participation table
      const { error } = await supabase
        .from('user_bar_crawl_participation')
        .insert({
          user_id: user.id,
          bar_crawl_id: id,
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

  return (
    <div className="mb-6">
      <div className="bg-material-surface p-4 rounded-xl shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{name}</h1>
        
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-material-on-surface-variant">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <UsersRound className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{participants} participants</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{stops} stops</span>
          </div>
        </div>
        
        {!canJoin && !isAlreadyJoined && (
          <Alert className="mb-4" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You can only join one bar crawl every 12 hours. Please try again in {cooldownTimeRemaining}.
            </AlertDescription>
          </Alert>
        )}
        
        {isAlreadyJoined && (
          <Alert className="mb-4" variant="default">
            <AlertDescription>
              You're already participating in this bar crawl. Enjoy the experience!
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            onClick={handleJoin} 
            className="bg-spiritless-pink hover:bg-spiritless-pink/90"
            disabled={isJoining || (!canJoin && !isAlreadyJoined) || isAlreadyJoined}
          >
            {isAlreadyJoined 
              ? "Already Joined!" 
              : isJoining 
                ? "Joining..." 
                : "Join Bar Crawl"}
          </Button>
          
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BarCrawlProfileHeader;

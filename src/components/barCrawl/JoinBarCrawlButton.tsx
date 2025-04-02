
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabaseClient';

interface JoinBarCrawlButtonProps {
  barCrawlId: string;
  className?: string;
}

const JoinBarCrawlButton: React.FC<JoinBarCrawlButtonProps> = ({ barCrawlId, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleJoinBarCrawl = async () => {
    // If not authenticated, show sign in message
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to join this bar crawl',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to join bar crawl:', barCrawlId);
      
      // Handle sample data IDs (like bc-123) vs real UUIDs
      const isSampleId = typeof barCrawlId === 'string' && barCrawlId.startsWith('bc-');
      
      if (isSampleId) {
        // For sample data, just simulate successful join
        console.log('Sample bar crawl detected, simulating join');
        
        // Store in localStorage for demo purposes
        const existingParticipations = JSON.parse(localStorage.getItem('user_bar_crawl_participations') || '[]');
        existingParticipations.push({
          id: `participation-${Date.now()}`,
          user_id: user.id || 'sample-user',
          bar_crawl_id: barCrawlId,
          joined_at: new Date().toISOString()
        });
        localStorage.setItem('user_bar_crawl_participations', JSON.stringify(existingParticipations));
        
        // Show success toast
        toast({
          title: 'Joined Bar Crawl',
          description: 'You have successfully joined this bar crawl!',
        });
      } else {
        // For real data, use Supabase
        const { error } = await supabaseClient
          .from('user_bar_crawl_participation')
          .insert({
            user_id: user.id,
            bar_crawl_id: barCrawlId
          });

        if (error) {
          console.error('Error joining bar crawl:', error);
          throw error;
        }

        toast({
          title: 'Joined Bar Crawl',
          description: 'You have successfully joined this bar crawl!',
        });
      }
    } catch (error: any) {
      console.error('Failed to join bar crawl:', error);
      
      // Show error toast with more descriptive message
      let errorMessage = 'Failed to join bar crawl. Please try again.';
      
      if (error?.message?.includes('violates row level security policy')) {
        errorMessage = 'You do not have permission to join this bar crawl.';
      } else if (error?.message?.includes('violates foreign key constraint')) {
        errorMessage = 'This bar crawl does not exist.';
      } else if (error?.message?.includes('violates unique constraint')) {
        errorMessage = 'You are already participating in this bar crawl.';
      } else if (error?.message?.includes('invalid input syntax')) {
        errorMessage = 'Invalid bar crawl ID format.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleJoinBarCrawl} 
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Joining...' : 'Join Bar Crawl'}
    </Button>
  );
};

export default JoinBarCrawlButton;

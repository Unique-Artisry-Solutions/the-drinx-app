
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface CheckInOptions {
  barCrawlId: string;
  establishmentId: string;
  establishmentName: string;
}

export function useCheckIn() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const performCheckIn = async ({ barCrawlId, establishmentId, establishmentName }: CheckInOptions) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to check in at this establishment",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsCheckingIn(true);

      // Insert record into bar_crawl_check_ins
      const { error } = await supabase
        .from('bar_crawl_check_ins')
        .insert({
          bar_crawl_id: barCrawlId,
          establishment_id: establishmentId,
          user_id: user.id
        });

      if (error) throw error;

      // Save last check-in time to local storage for cooldown
      localStorage.setItem('last_check_in_time', new Date().toISOString());
      localStorage.setItem('last_checked_in_establishment', establishmentId);
      
      toast({
        title: "Check-in successful!",
        description: `You've checked in at ${establishmentName}`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error checking in:', error);
      toast({
        title: "Check-in failed",
        description: error.message || "Failed to record your check-in. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCheckingIn(false);
    }
  };

  return {
    isCheckingIn,
    performCheckIn
  };
}

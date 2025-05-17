
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CheckInParams {
  barCrawlId: string;
  establishmentId: string;
  establishmentName: string;
  ticketId?: string;
}

export const useCheckIn = () => {
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
  const { toast } = useToast();

  const performCheckIn = async (params: CheckInParams): Promise<boolean> => {
    setIsCheckingIn(true);
    
    try {
      // If we have a specific ticket ID, use it
      if (params.ticketId) {
        // Use the service function to check in
        const response = await checkInWithTicket(params.ticketId, params.establishmentId);
        
        toast({
          title: "Check-in successful!",
          description: `You've checked in to ${params.establishmentName}`,
          variant: "default",
        });
        
        return true;
      } else {
        // Simulate check-in for demo purposes
        // In a real app, this would validate against a QR code or similar
        
        // Record the check-in locally
        const lastCheckIns = JSON.parse(localStorage.getItem('bar_crawl_check_ins') || '{}');
        lastCheckIns[params.barCrawlId] = {
          establishmentId: params.establishmentId,
          establishmentName: params.establishmentName,
          checkInTime: new Date().toISOString()
        };
        localStorage.setItem('bar_crawl_check_ins', JSON.stringify(lastCheckIns));
        
        // Record time of last check-in
        localStorage.setItem('last_check_in_time', new Date().toISOString());
        localStorage.setItem('last_checked_in_establishment', params.establishmentId);
        
        toast({
          title: "Check-in successful!",
          description: `You've checked in to ${params.establishmentName}`,
          variant: "default",
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      toast({
        title: "Check-in failed",
        description: error instanceof Error ? error.message : "An error occurred during check-in",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Helper function to check in with ticket ID
  const checkInWithTicket = async (ticketId: string, establishmentId: string) => {
    const { data: user } = await supabase.auth.getUser();
    
    const response = await fetch('/api/swig-circuit/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId,
        venueId: establishmentId,
        userId: user?.user?.id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Check-in failed');
    }
    
    return await response.json();
  };

  return {
    isCheckingIn,
    performCheckIn
  };
};

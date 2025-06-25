
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { calculateDistance } from '@/utils/locationUtils';

interface VisitData {
  rating: number | null;
  note: string;
}

export const useUserVisits = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const recordVisit = async (establishmentId: string, visitData: VisitData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to record visits",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsRecording(true);

      // Record the visit in user_visits table (you may need to create this table)
      const { error } = await supabase
        .from('user_visits')
        .insert({
          user_id: user.id,
          establishment_id: establishmentId,
          rating: visitData.rating,
          notes: visitData.note,
          visited_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      // Award points for the visit
      await supabase
        .from('reward_transactions')
        .insert({
          user_id: user.id,
          establishment_id: establishmentId,
          points: 10, // Base points for check-in
          transaction_type: 'earn',
          source: 'check_in',
          description: 'Check-in visit'
        });

      toast({
        title: "Visit recorded!",
        description: "You've earned 10 points for checking in",
      });

      return true;
    } catch (error) {
      console.error('Error recording visit:', error);
      toast({
        title: "Error recording visit",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsRecording(false);
    }
  };

  const verifyLocationAndRecordVisit = async (
    establishmentId: string,
    userLat: number,
    userLng: number,
    visitData: VisitData
  ) => {
    try {
      // Get establishment location
      const { data: establishment, error } = await supabase
        .from('establishments')
        .select('latitude, longitude, name')
        .eq('id', establishmentId)
        .single();

      if (error || !establishment) {
        throw new Error('Establishment not found');
      }

      // Calculate distance
      const distance = calculateDistance(
        userLat,
        userLng,
        establishment.latitude,
        establishment.longitude
      );

      // Check if user is within 0.1 miles (approximately 500 feet)
      if (distance > 0.1) {
        toast({
          title: "Too far away",
          description: "You need to be closer to the establishment to check in",
          variant: "destructive",
        });
        return false;
      }

      return await recordVisit(establishmentId, visitData);
    } catch (error) {
      console.error('Error verifying location:', error);
      toast({
        title: "Location verification failed",
        description: "Unable to verify your location",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    recordVisit,
    verifyLocationAndRecordVisit,
    isRecording
  };
};

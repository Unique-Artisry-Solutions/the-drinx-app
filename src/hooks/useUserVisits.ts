
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { calculateDistance } from '@/utils/locationUtils';

interface VisitData {
  rating: number | null;
  note: string;
}

interface Visit {
  id: string;
  establishment_id: string;
  rating: number | null;
  notes: string;
  visited_at: string;
  establishment?: {
    name: string;
    address: string;
    image_url?: string;
  };
}

interface VisitStats {
  totalVisits: number;
  uniqueEstablishments: number;
  averageRating: number;
  currentMonth: number;
}

export const useUserVisits = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [stats, setStats] = useState<VisitStats>({
    totalVisits: 0,
    uniqueEstablishments: 0,
    averageRating: 0,
    currentMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchVisits();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchVisits = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // For now, return mock data since user_visits table doesn't exist
      // TODO: Replace with actual database query once user_visits table is created
      const mockVisits: Visit[] = [
        {
          id: '1',
          establishment_id: 'est-1',
          rating: 4,
          notes: 'Great mocktails!',
          visited_at: new Date().toISOString(),
          establishment: {
            name: 'Downtown Mocktail Bar',
            address: '1200 18th St NW, Washington, DC 20036'
          }
        }
      ];

      setVisits(mockVisits);
      setStats({
        totalVisits: mockVisits.length,
        uniqueEstablishments: new Set(mockVisits.map(v => v.establishment_id)).size,
        averageRating: mockVisits.reduce((sum, v) => sum + (v.rating || 0), 0) / mockVisits.length,
        currentMonth: mockVisits.filter(v => 
          new Date(v.visited_at).getMonth() === new Date().getMonth()
        ).length
      });
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast({
        title: "Error loading visits",
        description: "Unable to load your visit history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      // TODO: Replace with actual database insert once user_visits table is created
      // For now, use reward_transactions table to record the visit
      const { error } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: user.id,
          establishment_id: establishmentId,
          points: 10, // Base points for check-in
          transaction_type: 'earn',
          source: 'check_in',
          description: 'Check-in visit',
          metadata: {
            rating: visitData.rating,
            notes: visitData.note
          }
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Visit recorded!",
        description: "You've earned 10 points for checking in",
      });

      // Refresh visits
      await fetchVisits();
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
    isRecording,
    visits,
    stats,
    isLoading
  };
};

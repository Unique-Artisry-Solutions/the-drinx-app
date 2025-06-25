
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { calculateDistance } from '@/utils/locationUtils';
import { Visit, UserVisitStats } from '@/types/VisitTypes';

interface VisitData {
  rating: number | null;
  note: string;
}

export const useUserVisits = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [stats, setStats] = useState<UserVisitStats>({
    totalVisits: 0,
    uniqueEstablishments: 0,
    averageRating: 0,
    currentMonth: 0,
    // Database naming for compatibility
    total_visits: 0,
    unique_establishments: 0,
    average_rating: 0,
    total_mocktails_tried: 0,
    first_visit_date: '',
    last_visit_date: '',
    visited_establishments: []
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
      
      // Create mock visits data that matches the expected Visit interface
      const mockVisits: Visit[] = [
        {
          id: '1',
          establishment_id: 'est-1',
          rating: 4,
          notes: 'Great mocktails!',
          visited_at: new Date().toISOString(),
          user_id: user.id,
          visit_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tried_mocktails: [],
          establishment: {
            name: 'Downtown Mocktail Bar',
            address: '1200 18th St NW, Washington, DC 20036'
          }
        }
      ];

      setVisits(mockVisits);
      
      // Set stats with both naming conventions for compatibility
      const visitStats: UserVisitStats = {
        totalVisits: mockVisits.length,
        uniqueEstablishments: new Set(mockVisits.map(v => v.establishment_id)).size,
        averageRating: mockVisits.reduce((sum, v) => sum + (v.rating || 0), 0) / mockVisits.length,
        currentMonth: mockVisits.filter(v => 
          new Date(v.visited_at).getMonth() === new Date().getMonth()
        ).length,
        // Database naming
        total_visits: mockVisits.length,
        unique_establishments: new Set(mockVisits.map(v => v.establishment_id)).size,
        average_rating: mockVisits.reduce((sum, v) => sum + (v.rating || 0), 0) / mockVisits.length,
        total_mocktails_tried: mockVisits.reduce((sum, v) => sum + v.tried_mocktails.length, 0),
        first_visit_date: mockVisits[0]?.visit_date || '',
        last_visit_date: mockVisits[mockVisits.length - 1]?.visit_date || '',
        visited_establishments: mockVisits.map(v => v.establishment_id)
      };
      
      setStats(visitStats);
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

      // Use reward_transactions table to record the visit for now
      const { error } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: user.id,
          establishment_id: establishmentId,
          points: 10,
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
      const { data: establishment, error } = await supabase
        .from('establishments')
        .select('latitude, longitude, name')
        .eq('id', establishmentId)
        .single();

      if (error || !establishment) {
        throw new Error('Establishment not found');
      }

      const distance = calculateDistance(
        userLat,
        userLng,
        establishment.latitude,
        establishment.longitude
      );

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

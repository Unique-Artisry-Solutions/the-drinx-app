import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UserVisitStats, Visit, TriedMocktail } from '@/types/VisitTypes';
import { calculateDistance } from '@/utils/locationUtils';

export const useUserVisits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock stats that match the UserVisitStats interface
  const [stats] = useState<UserVisitStats>(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    
    return {
      // Database naming (snake_case)
      total_visits: 0,
      unique_establishments: 0,
      average_rating: 0,
      total_mocktails_tried: 0,
      first_visit_date: new Date().toISOString(),
      last_visit_date: new Date().toISOString(),
      visited_establishments: [],
      current_month: currentMonth,
      // Component naming (camelCase) - for backward compatibility
      totalVisits: 0,
      uniqueEstablishments: 0,
      averageRating: 0,
      totalMocktailsTried: 0,
      currentMonth: currentMonth
    };
  });

  const recordVisit = async (establishmentId: string, visitData: { rating: number | null; note: string }) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_visits')
        .insert({
          user_id: user.id,
          establishment_id: establishmentId,
          visit_date: new Date().toISOString(),
          rating: visitData.rating,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Add note if provided
      if (visitData.note) {
        await supabase
          .from('visit_notes')
          .insert({
            visit_id: data.id,
            note: visitData.note,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      toast({
        title: "Visit recorded!",
        description: "Your visit has been successfully recorded.",
      });

      // Refresh visits
      await fetchVisits();
      return true;
    } catch (err) {
      console.error('Error recording visit:', err);
      toast({
        title: "Error",
        description: "Failed to record visit. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const verifyLocationAndRecordVisit = async (
    establishmentId: string,
    userLat: number,
    userLng: number,
    visitData: { rating: number | null; note: string }
  ) => {
    try {
      // Get establishment location
      const { data: establishment, error } = await supabase
        .from('establishments')
        .select('latitude, longitude')
        .eq('id', establishmentId)
        .single();

      if (error) throw error;

      // Calculate distance (assuming calculateDistance returns distance in miles)
      const distance = calculateDistance(userLat, userLng, establishment.latitude, establishment.longitude);
      const maxDistance = 0.1; // 0.1 miles = ~160 meters

      if (distance > maxDistance) {
        toast({
          title: "Too far away",
          description: "You need to be closer to the establishment to check in.",
          variant: "destructive",
        });
        return false;
      }

      return await recordVisit(establishmentId, visitData);
    } catch (err) {
      console.error('Error verifying location:', err);
      toast({
        title: "Error",
        description: "Failed to verify location. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchVisits = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // For now, return empty array since we don't have actual visits data
      // In a real implementation, this would query the user_visits table
      setVisits([]);
    } catch (err) {
      console.error('Error fetching visits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch visits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [user]);

  return {
    visits,
    stats,
    isLoading,
    error,
    recordVisit,
    verifyLocationAndRecordVisit,
    refetch: fetchVisits
  };
};

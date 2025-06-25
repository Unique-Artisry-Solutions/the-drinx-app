
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

  // Stats based on reward transactions for visits
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
      // Record visit as a reward transaction
      const { data: visitTransaction, error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: user.id,
          establishment_id: establishmentId,
          points: 10, // Default points for check-in
          transaction_type: 'earn',
          source: 'check_in',
          description: `Check-in at establishment`,
          metadata: {
            rating: visitData.rating,
            note: visitData.note,
            visit_date: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      toast({
        title: "Visit recorded!",
        description: "Your visit has been successfully recorded and you earned 10 points!",
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

      // Fetch visits from reward_transactions where source is 'check_in'
      const { data: visitTransactions, error: transactionError } = await supabase
        .from('reward_transactions')
        .select(`
          *,
          establishments!reward_transactions_establishment_id_fkey (
            id,
            name,
            address,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .eq('source', 'check_in')
        .order('created_at', { ascending: false });

      if (transactionError) throw transactionError;

      // Transform reward transactions to Visit format
      const transformedVisits: Visit[] = (visitTransactions || []).map(transaction => ({
        id: transaction.id,
        establishment_id: transaction.establishment_id || '',
        rating: transaction.metadata?.rating || null,
        notes: transaction.metadata?.note || '',
        visited_at: transaction.created_at,
        user_id: transaction.user_id,
        visit_date: transaction.metadata?.visit_date || transaction.created_at,
        created_at: transaction.created_at,
        updated_at: transaction.created_at,
        tried_mocktails: [], // This would need to be expanded if we track mocktails
        establishment: transaction.establishments ? {
          name: transaction.establishments.name,
          address: transaction.establishments.address,
          image_url: transaction.establishments.image_url
        } : undefined
      }));

      setVisits(transformedVisits);
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

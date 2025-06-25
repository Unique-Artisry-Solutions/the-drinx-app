
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { calculateDistance } from '@/utils/locationUtils';
import { Visit, UserVisitStats } from '@/types/VisitTypes';
import { getVisitMetadata, getMetadataRating, getMetadataNote, getMetadataVisitDate, toJsonCompatible } from '@/utils/typeGuards';

const POINTS_PER_VISIT = 10;
const CHECK_IN_RADIUS_METERS = 100;

export function useUserVisits() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const getUserVisits = async (): Promise<Visit[]> => {
    if (!user) return [];

    try {
      const { data: transactions } = await supabase
        .from('reward_transactions')
        .select(`
          *,
          establishments!inner(
            id,
            name,
            address,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .eq('event_type', 'check_in')
        .order('created_at', { ascending: false });

      if (!transactions) return [];

      return transactions.map(transaction => {
        const metadata = getVisitMetadata(transaction.metadata || {});
        const establishment = Array.isArray(transaction.establishments) 
          ? transaction.establishments[0] 
          : transaction.establishments;

        return {
          id: transaction.id,
          establishment_id: transaction.related_id || '',
          rating: getMetadataRating(transaction.metadata),
          notes: getMetadataNote(transaction.metadata),
          visited_at: getMetadataVisitDate(transaction.metadata),
          user_id: transaction.user_id,
          visit_date: getMetadataVisitDate(transaction.metadata),
          created_at: transaction.created_at,
          updated_at: transaction.created_at,
          tried_mocktails: [],
          establishment: establishment ? {
            name: establishment.name,
            address: establishment.address,
            image_url: establishment.image_url
          } : undefined,
        };
      });
    } catch (error) {
      console.error('Error fetching user visits:', error);
      return [];
    }
  };

  const getUserVisitStats = async (): Promise<UserVisitStats> => {
    if (!user) {
      return {
        total_visits: 0,
        unique_establishments: 0,
        average_rating: 0,
        total_mocktails_tried: 0,
        first_visit_date: '',
        last_visit_date: '',
        visited_establishments: [],
        current_month: 0,
        totalVisits: 0,
        uniqueEstablishments: 0,
        averageRating: 0,
        totalMocktailsTried: 0,
        currentMonth: 0,
      };
    }

    try {
      const { data: transactions } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', 'check_in')
        .order('created_at', { ascending: false });

      if (!transactions || transactions.length === 0) {
        return {
          total_visits: 0,
          unique_establishments: 0,
          average_rating: 0,
          total_mocktails_tried: 0,
          first_visit_date: '',
          last_visit_date: '',
          visited_establishments: [],
          current_month: 0,
          totalVisits: 0,
          uniqueEstablishments: 0,
          averageRating: 0,
          totalMocktailsTried: 0,
          currentMonth: 0,
        };
      }

      const totalVisits = transactions.length;
      const uniqueEstablishments = new Set(transactions.map(t => t.related_id)).size;
      
      // Calculate average rating using type-safe metadata access
      const ratingsWithValues = transactions
        .map(t => getMetadataRating(t.metadata))
        .filter((rating): rating is number => rating !== null);
      
      const averageRating = ratingsWithValues.length > 0 
        ? ratingsWithValues.reduce((sum, rating) => sum + rating, 0) / ratingsWithValues.length 
        : 0;

      const firstVisit = transactions[transactions.length - 1];
      const lastVisit = transactions[0];
      
      const currentMonth = transactions.filter(t => {
        const visitDate = new Date(getMetadataVisitDate(t.metadata));
        const now = new Date();
        return visitDate.getMonth() === now.getMonth() && 
               visitDate.getFullYear() === now.getFullYear();
      }).length;

      const visitedEstablishments = Array.from(new Set(transactions.map(t => t.related_id).filter(Boolean)));

      const stats = {
        total_visits: totalVisits,
        unique_establishments: uniqueEstablishments,
        average_rating: averageRating,
        total_mocktails_tried: 0, // This would need separate tracking
        first_visit_date: getMetadataVisitDate(firstVisit.metadata),
        last_visit_date: getMetadataVisitDate(lastVisit.metadata),
        visited_establishments: visitedEstablishments,
        current_month: currentMonth,
        // Backward compatibility camelCase versions
        totalVisits,
        uniqueEstablishments,
        averageRating,
        totalMocktailsTried: 0,
        currentMonth,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching visit stats:', error);
      return {
        total_visits: 0,
        unique_establishments: 0,
        average_rating: 0,
        total_mocktails_tried: 0,
        first_visit_date: '',
        last_visit_date: '',
        visited_establishments: [],
        current_month: 0,
        totalVisits: 0,
        uniqueEstablishments: 0,
        averageRating: 0,
        totalMocktailsTried: 0,
        currentMonth: 0,
      };
    }
  };

  const recordVisit = async (
    establishmentId: string, 
    visitData: { rating: number | null; note: string }
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to record a visit',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      const visitMetadata = toJsonCompatible({
        rating: visitData.rating,
        note: visitData.note,
        visit_date: new Date().toISOString(),
        establishment_id: establishmentId,
        user_id: user.id,
      });

      const { error } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: user.id,
          event_type: 'check_in',
          points_earned: POINTS_PER_VISIT,
          related_id: establishmentId,
          metadata: visitMetadata,
        });

      if (error) throw error;

      toast({
        title: 'Visit recorded!',
        description: `You earned ${POINTS_PER_VISIT} points for checking in!`,
      });

      return true;
    } catch (error) {
      console.error('Error recording visit:', error);
      toast({
        title: 'Error',
        description: 'Failed to record visit. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLocationAndRecordVisit = async (
    establishmentId: string,
    userLatitude: number,
    userLongitude: number,
    visitData: { rating: number | null; note: string }
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to check in',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Get establishment location
      const { data: establishment, error: establishmentError } = await supabase
        .from('establishments')
        .select('latitude, longitude, name')
        .eq('id', establishmentId)
        .single();

      if (establishmentError || !establishment) {
        throw new Error('Establishment not found');
      }

      // Calculate distance
      const distance = calculateDistance(
        userLatitude,
        userLongitude,
        establishment.latitude,
        establishment.longitude
      );
      
      const distanceInMeters = distance * 1609.34; // Convert miles to meters

      if (distanceInMeters > CHECK_IN_RADIUS_METERS) {
        toast({
          title: 'Too far away',
          description: `You need to be within ${CHECK_IN_RADIUS_METERS}m of ${establishment.name} to check in`,
          variant: 'destructive',
        });
        return false;
      }

      // Record the visit with location verification
      return await recordVisit(establishmentId, visitData);
    } catch (error) {
      console.error('Error verifying location and recording visit:', error);
      toast({
        title: 'Check-in failed',
        description: 'Unable to verify your location. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getUserVisits,
    getUserVisitStats,
    recordVisit,
    verifyLocationAndRecordVisit,
    isLoading,
  };
}

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { checkInService, CheckInOptions, CheckInResult, EstablishmentCheckIn, UserVisitStats } from '@/services/checkInService';
import { RewardTransaction } from '@/types/rewards/api';

export type { UserVisitStats } from '@/services/checkInService';

export const useUserVisits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const recordVisit = useCallback(async (
    establishmentId: string,
    options: Omit<CheckInOptions, 'userId'> = {}
  ): Promise<CheckInResult | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to record visits",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const context: EstablishmentCheckIn = {
        type: 'establishment',
        entityId: establishmentId,
        entityName: options.establishmentName || 'Establishment'
      };

      const result = await checkInService.performCheckIn(user.id, context, {
        userId: user.id,
        ...options
      });
      
      if (result.success) {
        toast({
          title: "Check-in successful!",
          description: result.message,
        });
      } else {
        toast({
          title: "Check-in failed",
          description: result.message,
          variant: "destructive",
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error recording visit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record visit",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const verifyLocationAndRecordVisit = useCallback(async (
    establishmentId: string,
    userLatitude: number,
    userLongitude: number,
    options: Omit<CheckInOptions, 'userId'> = {}
  ): Promise<CheckInResult | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to record visits",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const context: EstablishmentCheckIn = {
        type: 'establishment',
        entityId: establishmentId,
        entityName: options.establishmentName || 'Establishment',
        locationData: {
          latitude: userLatitude,
          longitude: userLongitude
        }
      };

      const result = await checkInService.performCheckIn(user.id, context, {
        userId: user.id,
        ...options
      });
      
      if (result.success) {
        toast({
          title: "Check-in successful!",
          description: result.message,
        });
      } else {
        toast({
          title: "Check-in failed",
          description: result.message,
          variant: "destructive",
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error recording visit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record visit",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const getUserVisits = useCallback(async (options: {
    limit?: number;
    offset?: number;
  } = {}): Promise<RewardTransaction[]> => {
    if (!user) return [];

    try {
      return await checkInService.getCheckInHistory(user.id, {
        type: 'establishment',
        ...options
      });
    } catch (error) {
      console.error('Error fetching user visits:', error);
      return [];
    }
  }, [user]);

  const getUserVisitStats = useCallback(async (): Promise<UserVisitStats> => {
    if (!user) {
      return {
        total_visits: 0,
        unique_establishments: 0,
        total_points_earned: 0,
        visited_entities: []
      };
    }

    try {
      return await checkInService.getVisitStats(user.id);
    } catch (error) {
      console.error('Error fetching visit stats:', error);
      return {
        total_visits: 0,
        unique_establishments: 0,
        total_points_earned: 0,
        visited_entities: []
      };
    }
  }, [user]);

  return {
    recordVisit,
    verifyLocationAndRecordVisit,
    getUserVisits,
    getUserVisitStats,
    isLoading
  };
};

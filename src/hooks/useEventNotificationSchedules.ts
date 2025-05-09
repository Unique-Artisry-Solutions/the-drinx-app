
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { EventNotificationSchedule } from '@/types/SubscriptionTypes';
import { useRetry } from '@/hooks/useRetry';

export const useEventNotificationSchedules = (eventId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeWithRetry } = useRetry({
    maxAttempts: 3,
    baseDelay: 1000,
    onFailure: (error) => {
      toast({
        title: 'Operation failed after multiple attempts',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Fetch notification schedules for a specific event
  const { data: schedules = [], isLoading, error, refetch } = useQuery({
    queryKey: ['event-notification-schedules', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      try {
        const { data, error } = await supabase
          .from('event_notification_schedules')
          .select('*')
          .eq('event_id', eventId)
          .order('scheduled_for', { ascending: true });
          
        if (error) throw error;
        return data as EventNotificationSchedule[];
      } catch (error) {
        console.error('Failed to fetch event notification schedules:', error);
        throw error;
      }
    },
    enabled: !!eventId,
  });

  // Create new notification schedule
  const createSchedule = useCallback(async (schedule: Omit<EventNotificationSchedule, 'id' | 'created_at' | 'updated_at'>) => {
    if (!eventId) {
      toast({ title: 'Error', description: 'No event selected', variant: 'destructive' });
      return null;
    }
    
    setIsSubmitting(true);
    
    try {
      return await executeWithRetry(async () => {
        const { data, error } = await supabase
          .from('event_notification_schedules')
          .insert({ ...schedule, event_id: eventId })
          .select()
          .single();
          
        if (error) throw error;
        
        toast({
          title: 'Schedule created',
          description: 'Notification schedule has been created successfully',
        });
        
        queryClient.invalidateQueries({ queryKey: ['event-notification-schedules', eventId] });
        return data as EventNotificationSchedule;
      });
    } catch (error: any) {
      toast({
        title: 'Failed to create schedule',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [eventId, executeWithRetry, queryClient, toast]);

  // Update existing notification schedule
  const updateSchedule = useCallback(async (scheduleId: string, updates: Partial<EventNotificationSchedule>) => {
    setIsSubmitting(true);
    
    try {
      return await executeWithRetry(async () => {
        const { data, error } = await supabase
          .from('event_notification_schedules')
          .update(updates)
          .eq('id', scheduleId)
          .select()
          .single();
          
        if (error) throw error;
        
        toast({
          title: 'Schedule updated',
          description: 'Notification schedule has been updated successfully',
        });
        
        queryClient.invalidateQueries({ queryKey: ['event-notification-schedules', eventId] });
        return data as EventNotificationSchedule;
      });
    } catch (error: any) {
      toast({
        title: 'Failed to update schedule',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [eventId, executeWithRetry, queryClient, toast]);

  // Delete notification schedule
  const deleteSchedule = useCallback(async (scheduleId: string) => {
    setIsSubmitting(true);
    
    try {
      return await executeWithRetry(async () => {
        const { error } = await supabase
          .from('event_notification_schedules')
          .delete()
          .eq('id', scheduleId);
          
        if (error) throw error;
        
        toast({
          title: 'Schedule deleted',
          description: 'Notification schedule has been deleted successfully',
        });
        
        queryClient.invalidateQueries({ queryKey: ['event-notification-schedules', eventId] });
        return true;
      });
    } catch (error: any) {
      toast({
        title: 'Failed to delete schedule',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [eventId, executeWithRetry, queryClient, toast]);

  return {
    schedules,
    isLoading,
    error,
    isSubmitting,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refetch
  };
};

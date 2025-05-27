
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { promoterNotificationTriggerService } from '@/services/PromoterNotificationTriggerService';

export function usePromoterNotificationTriggers() {
  const { toast } = useToast();

  const triggerEventUpdate = useMutation({
    mutationFn: async ({
      promoterId,
      eventData
    }: {
      promoterId: string;
      eventData: {
        id: string;
        title: string;
        description?: string;
        eventType: 'created' | 'updated' | 'cancelled';
      };
    }) => {
      return promoterNotificationTriggerService.triggerEventUpdate(promoterId, eventData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: 'Event notification sent',
          description: `Notified ${result.sentCount} followers`,
        });
      } else {
        toast({
          title: 'Notification failed',
          description: result.errors?.[0] || 'Unknown error',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send notifications',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const triggerPromotion = useMutation({
    mutationFn: async ({
      promoterId,
      promotionData
    }: {
      promoterId: string;
      promotionData: {
        id: string;
        title: string;
        discountCode?: string;
        expiresAt?: string;
      };
    }) => {
      return promoterNotificationTriggerService.triggerPromotion(promoterId, promotionData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: 'Promotion notification sent',
          description: `Notified ${result.sentCount} followers`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send promotion notifications',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const triggerGeneralUpdate = useMutation({
    mutationFn: async ({
      promoterId,
      updateData
    }: {
      promoterId: string;
      updateData: {
        title: string;
        content: string;
        priority?: 'low' | 'medium' | 'high' | 'urgent';
      };
    }) => {
      return promoterNotificationTriggerService.triggerGeneralUpdate(promoterId, updateData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: 'Update notification sent',
          description: `Notified ${result.sentCount} followers`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send update notifications',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    triggerEventUpdate,
    triggerPromotion,
    triggerGeneralUpdate
  };
}

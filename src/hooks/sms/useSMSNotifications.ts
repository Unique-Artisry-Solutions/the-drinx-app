import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export interface SMSNotificationParams {
  phoneNumber: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  userId?: string;
  notificationId?: string;
}

export interface BulkSMSParams {
  recipients: Array<{
    phoneNumber: string;
    userId?: string;
    variables?: Record<string, any>;
  }>;
  message: string;
  templateId?: string;
  campaignId?: string;
  scheduledFor?: string;
}

export interface PhoneNumberManagement {
  phoneNumber: string;
  countryCode?: string;
  isVerified?: boolean;
  smsOptIn?: boolean;
}

export const useSMSNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Send individual SMS
  const sendSMS = useMutation({
    mutationFn: async (params: SMSNotificationParams) => {
      const { data, error } = await supabase.functions.invoke('sms-notifications', {
        body: {
          action: 'sendSMS',
          params
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'SMS Sent',
        description: 'SMS notification sent successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'SMS Failed',
        description: error.message || 'Failed to send SMS notification',
        variant: 'destructive'
      });
    }
  });

  // Send bulk SMS
  const sendBulkSMS = useMutation({
    mutationFn: async (params: BulkSMSParams) => {
      const { data, error } = await supabase.functions.invoke('sms-notifications', {
        body: {
          action: 'sendBulkSMS',
          params
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      const summary = data.summary || {};
      toast({
        title: 'Bulk SMS Sent',
        description: `Successfully sent ${summary.successful}/${summary.total} messages`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Bulk SMS Failed',
        description: error.message || 'Failed to send bulk SMS',
        variant: 'destructive'
      });
    }
  });

  // Send template-based SMS
  const sendTemplateSMS = useMutation({
    mutationFn: async (params: {
      phoneNumber: string;
      templateKey: string;
      variables?: Record<string, any>;
      userId?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('sms-notifications', {
        body: {
          action: 'sendTemplate',
          params
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Template SMS Sent',
        description: 'Template SMS sent successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Template SMS Failed',
        description: error.message || 'Failed to send template SMS',
        variant: 'destructive'
      });
    }
  });

  // Test SMS functionality
  const testSMS = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const { data, error } = await supabase.functions.invoke('sms-notifications', {
        body: {
          action: 'testSMS',
          params: {
            phoneNumber,
            userId: user?.id
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Test SMS Sent',
        description: 'Test SMS notification sent successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Test SMS Failed',
        description: error.message || 'Failed to send test SMS',
        variant: 'destructive'
      });
    }
  });

  // Validate phone number
  const validatePhone = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const { data, error } = await supabase.functions.invoke('sms-notifications', {
        body: {
          action: 'validatePhone',
          params: { phoneNumber }
        }
      });

      if (error) throw error;
      return data;
    }
  });

  // Opt in user
  const optInUser = useMutation({
    mutationFn: async (params: { phoneNumber: string; userId: string }) => {
      const { data, error } = await supabase.functions.invoke('sms-notifications', {
        body: {
          action: 'optInUser',
          params
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'SMS Opt-in Successful',
        description: 'User has been opted in to SMS notifications',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'SMS Opt-in Failed',
        description: error.message || 'Failed to opt in user',
        variant: 'destructive'
      });
    }
  });

  // Opt out user
  const optOutUser = useMutation({
    mutationFn: async (params: { phoneNumber: string; userId: string }) => {
      const { data, error } = await supabase.functions.invoke('sms-notifications', {
        body: {
          action: 'optOutUser',
          params
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'SMS Opt-out Successful',
        description: 'User has been opted out of SMS notifications',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'SMS Opt-out Failed',
        description: error.message || 'Failed to opt out user',
        variant: 'destructive'
      });
    }
  });

  // Get SMS delivery status
  const getSMSDeliveryStatus = (userId?: string) => {
    return useQuery({
      queryKey: ['sms-delivery-status', userId],
      queryFn: async () => {
        const { data, error } = await supabase.functions.invoke('notifications', {
          body: {
            action: 'getSMSDeliveryStatus',
            params: {
              userId: userId || user?.id,
              limit: 100
            }
          }
        });

        if (error) throw error;
        return data.data || [];
      },
      enabled: !!(userId || user?.id)
    });
  };

  return {
    sendSMS,
    sendBulkSMS,
    sendTemplateSMS,
    testSMS,
    validatePhone,
    optInUser,
    optOutUser,
    getSMSDeliveryStatus
  };
};
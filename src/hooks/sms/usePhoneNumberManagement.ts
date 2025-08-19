import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export interface PhoneNumber {
  id: string;
  user_id: string;
  phone_number: string;
  country_code: string;
  is_verified: boolean;
  is_primary: boolean;
  sms_opt_in: boolean;
  sms_opt_in_date?: string;
  sms_opt_out_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AddPhoneNumberParams {
  phoneNumber: string;
  countryCode?: string;
  isPrimary?: boolean;
  smsOptIn?: boolean;
}

export const usePhoneNumberManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's phone numbers
  const getPhoneNumbers = useQuery({
    queryKey: ['user-phone-numbers', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_phone_numbers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Add phone number
  const addPhoneNumber = useMutation({
    mutationFn: async (params: AddPhoneNumberParams) => {
      if (!user?.id) throw new Error('User not authenticated');

      // First validate the phone number
      const { data: validation, error: validationError } = await supabase.functions.invoke('sms-notifications', {
        body: {
          action: 'validatePhone',
          params: { phoneNumber: params.phoneNumber }
        }
      });

      if (validationError || !validation.isValid) {
        throw new Error(validation.error || 'Invalid phone number format');
      }

      const { data, error } = await supabase
        .from('user_phone_numbers')
        .insert({
          user_id: user.id,
          phone_number: validation.formatted,
          country_code: params.countryCode || '+1',
          is_primary: params.isPrimary || false,
          sms_opt_in: params.smsOptIn || false,
          is_verified: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-phone-numbers'] });
      toast({
        title: 'Phone Number Added',
        description: 'Phone number added successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Add Phone',
        description: error.message || 'Failed to add phone number',
        variant: 'destructive'
      });
    }
  });

  // Update phone number
  const updatePhoneNumber = useMutation({
    mutationFn: async (params: { id: string; updates: Partial<PhoneNumber> }) => {
      const { data, error } = await supabase
        .from('user_phone_numbers')
        .update(params.updates)
        .eq('id', params.id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-phone-numbers'] });
      toast({
        title: 'Phone Updated',
        description: 'Phone number updated successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update phone number',
        variant: 'destructive'
      });
    }
  });

  // Delete phone number
  const deletePhoneNumber = useMutation({
    mutationFn: async (phoneId: string) => {
      const { error } = await supabase
        .from('user_phone_numbers')
        .delete()
        .eq('id', phoneId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-phone-numbers'] });
      toast({
        title: 'Phone Removed',
        description: 'Phone number removed successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete phone number',
        variant: 'destructive'
      });
    }
  });

  // Toggle SMS opt-in
  const toggleSMSOptIn = useMutation({
    mutationFn: async (params: { phoneId: string; optIn: boolean }) => {
      const phoneNumber = getPhoneNumbers.data?.find(p => p.id === params.phoneId);
      if (!phoneNumber) throw new Error('Phone number not found');

      if (params.optIn) {
        // Opt in via SMS service
        const { data, error } = await supabase.functions.invoke('sms-notifications', {
          body: {
            action: 'optInUser',
            params: {
              phoneNumber: phoneNumber.phone_number,
              userId: user?.id
            }
          }
        });
        if (error) throw error;
      } else {
        // Opt out via SMS service
        const { data, error } = await supabase.functions.invoke('sms-notifications', {
          body: {
            action: 'optOutUser',
            params: {
              phoneNumber: phoneNumber.phone_number,
              userId: user?.id
            }
          }
        });
        if (error) throw error;
      }

      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-phone-numbers'] });
      toast({
        title: variables.optIn ? 'SMS Enabled' : 'SMS Disabled',
        description: variables.optIn ? 
          'You will receive SMS notifications' : 
          'You will no longer receive SMS notifications'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'SMS Preference Update Failed',
        description: error.message || 'Failed to update SMS preferences',
        variant: 'destructive'
      });
    }
  });

  // Send verification SMS
  const sendVerificationSMS = useMutation({
    mutationFn: async (phoneId: string) => {
      const phoneNumber = getPhoneNumbers.data?.find(p => p.id === phoneId);
      if (!phoneNumber) throw new Error('Phone number not found');

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Update phone number with verification code
      const { error: updateError } = await supabase
        .from('user_phone_numbers')
        .update({
          verification_code: verificationCode,
          verification_code_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        })
        .eq('id', phoneId);

      if (updateError) throw updateError;

      // Send verification SMS
      const { data, error } = await supabase.functions.invoke('sms-notifications', {
        body: {
          action: 'sendTemplate',
          params: {
            phoneNumber: phoneNumber.phone_number,
            templateKey: 'verification_code',
            variables: { code: verificationCode },
            userId: user?.id
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Verification Sent',
        description: 'Verification code sent to your phone'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Failed to send verification code',
        variant: 'destructive'
      });
    }
  });

  // Verify phone number
  const verifyPhoneNumber = useMutation({
    mutationFn: async (params: { phoneId: string; code: string }) => {
      const phoneNumber = getPhoneNumbers.data?.find(p => p.id === params.phoneId);
      if (!phoneNumber) throw new Error('Phone number not found');

      if (phoneNumber.verification_code !== params.code) {
        throw new Error('Invalid verification code');
      }

      if (phoneNumber.verification_code_expires_at && 
          new Date(phoneNumber.verification_code_expires_at) < new Date()) {
        throw new Error('Verification code has expired');
      }

      const { data, error } = await supabase
        .from('user_phone_numbers')
        .update({
          is_verified: true,
          verification_code: null,
          verification_code_expires_at: null
        })
        .eq('id', params.phoneId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-phone-numbers'] });
      toast({
        title: 'Phone Verified',
        description: 'Phone number verified successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Failed to verify phone number',
        variant: 'destructive'
      });
    }
  });

  return {
    phoneNumbers: getPhoneNumbers.data || [],
    isLoading: getPhoneNumbers.isLoading,
    addPhoneNumber,
    updatePhoneNumber,
    deletePhoneNumber,
    toggleSMSOptIn,
    sendVerificationSMS,
    verifyPhoneNumber,
    refetch: getPhoneNumbers.refetch
  };
};

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { safeJsonToRecord } from '@/utils/typeGuards';

export const useEventQuery = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is required');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Event not found');

      // Process location details safely
      const locationDetails = safeJsonToRecord(data.location_details, {
        address: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      });

      // Process contact info safely
      const contactInfo = safeJsonToRecord(data.contact_info, {
        name: '',
        email: '',
        phone: ''
      });

      return {
        ...data,
        location_details: locationDetails,
        contact_info: contactInfo
      };
    },
    enabled: !!eventId
  });
};

export const useEventsQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: ['events', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }
  });
};

export const useEventsByStatusQuery = (status: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['events', status, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!status
  });
};

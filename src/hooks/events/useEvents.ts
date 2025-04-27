
import { supabase } from '@/integrations/supabase/client';
import { EventType } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';
import { useState, useCallback } from 'react';

export const useEvents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPublishedEvents = useCallback(async (): Promise<EventType[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          name,
          description,
          date,
          time,
          venue_id,
          image_url,
          promotional_materials,
          status,
          created_at,
          updated_at,
          created_by,
          event_ticket_types (
            id,
            name,
            price,
            description,
            quantity
          )
        `)
        .eq('status', 'published');

      if (error) throw error;
      if (!data) return [];

      return data.map(event => ({
        id: event.id,
        name: event.name,
        description: event.description || '',
        date: event.date,
        time: event.time,
        venue_id: event.venue_id,
        image_url: event.image_url || '',
        promotional_materials: event.promotional_materials || [],
        status: event.status,
        distance: 0,
        ticketTypes: event.event_ticket_types.map(ticket => ({
          id: ticket.id,
          name: ticket.name,
          price: ticket.price,
          description: ticket.description,
          quantity: ticket.quantity,
          sold: 0,
          available: ticket.quantity
        })),
        venue: {
          id: event.venue_id || '',
          name: '',
          address: ''
        },
        attendees: {
          registered: 0,
          capacity: event.event_ticket_types.reduce((sum, ticket) => sum + ticket.quantity, 0),
          checkedIn: 0
        },
        revenue: {
          total: 0,
          ticketSales: 0,
          additionalSales: 0
        },
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        createdBy: event.created_by
      }));

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching events",
        description: err.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    fetchPublishedEvents,
    isLoading,
    error,
  };
};

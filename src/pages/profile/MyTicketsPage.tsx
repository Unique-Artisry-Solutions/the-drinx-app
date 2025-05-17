import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QRCodeLightbox from '@/components/qrcode/QRCodeLightbox';
import Layout from '@/components/Layout';
import TicketsTabContent from '@/components/tickets/TicketsTabContent';
import NoTicketsView from '@/components/tickets/NoTicketsView';
import { EventTicket, SwigCircuitTicket } from '@/types/TicketTypes';

const MyTicketsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeQR, setActiveQR] = React.useState<null | {
    code: string;
    name: string;
    details: string;
  }>(null);

  // Fetch event tickets
  const { data: eventTickets = [], isLoading: loadingEventTickets } = useQuery({
    queryKey: ['myEventTickets'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          event:event_id (*, venue:venue_id(*)),
          ticket_type:ticket_type_id (*)
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) {
        toast({
          title: 'Error loading tickets',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Fetch swig circuit tickets with added venue name information
  const { data: swigTickets = [], isLoading: loadingSwigTickets } = useQuery({
    queryKey: ['mySwigTickets'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Use raw string for table name to bypass type checking
      const { data, error } = await supabase
        .from('swig_circuit_attendees' as any)
        .select(`
          id,
          swig_circuit_id,
          user_id,
          ticket_type_id,
          quantity,
          purchase_date,
          status,
          ticket_code,
          checked_in_at,
          first_check_in,
          created_at,
          updated_at,
          purchaser_info,
          swig_circuit:swig_circuit_id (
            id,
            name,
            date
          ),
          ticket_tier:ticket_type_id (
            id,
            name,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) {
        toast({
          title: 'Error loading tickets',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      // Process the raw data to ensure it matches our expected SwigCircuitTicket interface
      const processedData: SwigCircuitTicket[] = (data || []).map(item => ({
        id: item.id,
        swig_circuit_id: item.swig_circuit_id,
        user_id: item.user_id,
        ticket_type_id: item.ticket_type_id,
        quantity: item.quantity || 1,
        purchase_date: item.purchase_date,
        checked_in_at: item.checked_in_at,
        first_check_in: item.first_check_in,
        status: item.status,
        ticket_code: item.ticket_code,
        created_at: item.created_at,
        updated_at: item.updated_at,
        purchaser_info: item.purchaser_info || { name: '', email: '' },
        ticket_tier: item.ticket_tier,
        venue_name: item.swig_circuit?.name || 'Unknown Venue',
      }));

      return processedData;
    },
    enabled: !!user,
  });

  const showTicketQR = (code: string, name: string, details: string) => {
    setActiveQR({ code, name, details });
  };

  const closeQR = () => setActiveQR(null);

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">
            You need to be signed in to view your tickets.
          </p>
          <a href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary/90">
            Sign In
          </a>
        </div>
      </Layout>
    );
  }

  const isLoading = loadingEventTickets || loadingSwigTickets;
  const hasEventTickets = eventTickets && eventTickets.length > 0;
  const hasSwigTickets = swigTickets && swigTickets.length > 0;
  const hasAnyTickets = hasEventTickets || hasSwigTickets;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            View and manage your tickets for events and Swig Circuits
          </p>
        </div>

        <Tabs defaultValue="events">
          <TabsList className="mb-6">
            <TabsTrigger value="events">Event Tickets</TabsTrigger>
            <TabsTrigger value="swig">Swig Circuit Passes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <TicketsTabContent
              type="event"
              tickets={eventTickets as EventTicket[]}
              isLoading={loadingEventTickets}
              onShowQR={showTicketQR}
            />
          </TabsContent>
          
          <TabsContent value="swig">
            <TicketsTabContent
              type="swig"
              tickets={swigTickets as SwigCircuitTicket[]}
              isLoading={loadingSwigTickets}
              onShowQR={showTicketQR}
            />
          </TabsContent>
        </Tabs>

        {activeQR && (
          <QRCodeLightbox
            value={activeQR.code}
            title={activeQR.name}
            subtitle={activeQR.details}
            isOpen={true}
            onClose={closeQR}
          />
        )}

        {!isLoading && !hasAnyTickets && <NoTicketsView />}
      </div>
    </Layout>
  );
};

export default MyTicketsPage;

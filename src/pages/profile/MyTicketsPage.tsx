
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import QRCodeLightbox from '@/components/qrcode/QRCodeLightbox';
import Layout from '@/components/Layout';

interface EventTicket {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type_id?: string;
  purchase_date: string;
  checked_in_at?: string;
  status: string;
  ticket_code: string;
  event: {
    id: string;
    name: string;
    date: string;
    time: string;
    venue?: {
      id: string;
      name: string;
    }
  };
  ticket_type?: {
    id: string;
    name: string;
    price: number;
  };
}

interface SwigCircuitTicket {
  id: string;
  swig_circuit_id: string;
  user_id: string;
  ticket_tier_id?: string;
  purchase_date: string;
  status: string;
  ticket_code?: string;
  swig_circuit?: {
    id: string;
    name: string;
    date?: string;
    time?: string;
  };
  ticket_tier?: {
    id: string;
    name: string;
    price: number;
  };
}

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

  // Fetch swig circuit tickets
  const { data: swigTickets = [], isLoading: loadingSwigTickets } = useQuery({
    queryKey: ['mySwigTickets'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Use the supabaseClient directly to avoid type issues with swig_circuit_attendees
      const { data, error } = await supabase
        .from('swig_circuit_attendees')
        .select(`
          *,
          swig_circuit:swig_circuit_id (*),
          ticket_tier:ticket_type_id (*)
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

      const typedData = data as unknown as SwigCircuitTicket[];
      return typedData || [];
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
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </Layout>
    );
  }

  const isLoading = loadingEventTickets || loadingSwigTickets;
  const hasEventTickets = eventTickets && eventTickets.length > 0;
  const hasSwigTickets = swigTickets && swigTickets.length > 0;
  const hasAnyTickets = hasEventTickets || hasSwigTickets;

  const renderTicketSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      ))}
    </div>
  );

  const renderEventTickets = () => {
    if (!hasEventTickets) {
      return (
        <div className="text-center py-12">
          <Ticket className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No Event Tickets</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't purchased any event tickets yet.
          </p>
          <Button className="mt-4" asChild>
            <a href="/events">Browse Events</a>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eventTickets.map((ticket: EventTicket) => (
          <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg">{ticket.event.name}</h3>
            <div className="text-sm text-muted-foreground space-y-1 mt-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(ticket.event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{ticket.event.time}</span>
              </div>
              {ticket.event.venue && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{ticket.event.venue.name}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-medium">{ticket.ticket_type ? ticket.ticket_type.name : 'General Admission'}</span>
              <Button size="sm" onClick={() => showTicketQR(
                ticket.ticket_code || '',
                ticket.event.name,
                `${new Date(ticket.event.date).toLocaleDateString()} at ${ticket.event.time}`
              )}>
                Show QR Code
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSwigTickets = () => {
    if (!hasSwigTickets) {
      return (
        <div className="text-center py-12">
          <Ticket className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No Swig Circuit Tickets</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't purchased any Swig Circuit tickets yet.
          </p>
          <Button className="mt-4" asChild>
            <a href="/swig-circuits">Browse Swig Circuits</a>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {swigTickets.map((ticket: SwigCircuitTicket) => {
          // Use safe navigation for properties that might not exist
          const swigCircuit = ticket.swig_circuit || {};
          const circuitDate = swigCircuit.date ? new Date(swigCircuit.date).toLocaleDateString() : 
                              ticket.purchase_date ? new Date(ticket.purchase_date).toLocaleDateString() : 'No date';
          
          return (
            <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg">{swigCircuit.name || 'Swig Circuit'}</h3>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{circuitDate}</span>
                </div>
                {swigCircuit.time && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{swigCircuit.time}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-medium">
                  {(ticket.ticket_tier && ticket.ticket_tier.name) || 'Standard Ticket'}
                </span>
                <Button size="sm" onClick={() => showTicketQR(
                  ticket.ticket_code || ticket.id,
                  swigCircuit.name || 'Swig Circuit',
                  `Swig Circuit Pass`
                )}>
                  Show QR Code
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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
            {isLoading ? renderTicketSkeleton() : renderEventTickets()}
          </TabsContent>
          
          <TabsContent value="swig">
            {isLoading ? renderTicketSkeleton() : renderSwigTickets()}
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

        {!isLoading && !hasAnyTickets && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              You don't have any tickets yet. Browse our events and Swig Circuits to get started.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild>
                <a href="/events">Browse Events</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/swig-circuits">Explore Swig Circuits</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTicketsPage;

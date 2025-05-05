
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Calendar, Clock, MapPin, Users, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';

// Define extended ticket type interface to include the sold property
interface EventTicketTypeWithSold {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold?: number;
}

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch event details
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_ticket_types (*),
          venue:venue_id (id, name, address)
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: 'Error loading event',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!selectedTicket || !event) {
      toast({
        title: 'Please select a ticket',
        variant: 'destructive',
      });
      return;
    }

    const ticketType = event.event_ticket_types.find(ticket => ticket.id === selectedTicket);
    if (!ticketType) return;

    addItem({
      id: `${event.id}-${selectedTicket}-${Date.now()}`,
      name: `${event.name} - ${ticketType.name}`,
      price: ticketType.price * quantity,
      interval: 'one-time',
      type: 'event_ticket',
      eventId: event.id,
      ticketTypeId: ticketType.id,
      ticketName: ticketType.name,
      date: event.date,
      time: event.time,
      venue: event.venue?.name,
      quantity: quantity
    });

    toast({
      title: 'Added to cart',
      description: `${quantity} ${ticketType.name} ticket${quantity > 1 ? 's' : ''} for ${event.name} added to your cart.`,
    });

    // Navigate to checkout
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-6 w-5/6 mb-6" />
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            <div>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-40 w-full rounded-md mb-6" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <p className="text-muted-foreground mb-8">
            The event you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => navigate('/events')}>
            View All Events
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{event.time}</span>
            </div>
            {event.venue && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.venue.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Event Image */}
        {event.image_url && (
          <div className="mb-8">
            <img 
              src={event.image_url} 
              alt={event.name} 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Event Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
            <p className="text-muted-foreground whitespace-pre-line mb-6">
              {event.description || 'No description available for this event.'}
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <p className="text-muted-foreground mb-1">
              {event.venue ? event.venue.name : 'TBD'}
            </p>
            <p className="text-muted-foreground">
              {event.venue ? event.venue.address : 'Location will be announced soon'}
            </p>
          </div>

          {/* Ticket Selection */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Select Tickets
                </h2>

                {event.event_ticket_types && event.event_ticket_types.length > 0 ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {event.event_ticket_types.map((ticket: EventTicketTypeWithSold) => {
                        // Calculate tickets sold - default to 0 if not available
                        const ticketsSold = ticket.sold || 0;
                        const remainingTickets = ticket.quantity - ticketsSold;
                        
                        return (
                          <div 
                            key={ticket.id}
                            className={`p-4 border rounded-md cursor-pointer ${
                              selectedTicket === ticket.id ? 'border-purple-500 bg-purple-50' : ''
                            }`}
                            onClick={() => setSelectedTicket(ticket.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{ticket.name}</h3>
                                <p className="text-sm text-muted-foreground">{ticket.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">${ticket.price.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {remainingTickets} remaining
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Quantity
                      </label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} ticket{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={handleAddToCart}
                      disabled={!selectedTicket}
                    >
                      Add to Cart
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No tickets are currently available for this event.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;

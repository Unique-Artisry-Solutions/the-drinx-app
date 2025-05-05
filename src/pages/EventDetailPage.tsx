
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import DetailPageMasthead from '@/components/shared/DetailPageMasthead';
import { Button } from '@/components/ui/button';
import { useEventDetails } from '@/hooks/events/useEventDetails';
import { useCart } from '@/contexts/CartContext';
import { Loader2, MapPin, Calendar, Clock, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { event, isLoading, error } = useEventDetails(id || '');
  const { addItem } = useCart();

  const handleBuyTicket = (ticketType: any) => {
    if (!event) return;
    
    addItem({
      id: `${event.id}-${ticketType.id}`,
      type: 'event_ticket',
      name: event.name,
      price: ticketType.price,
      quantity: 1,
      ticketName: ticketType.name,
      eventId: event.id,
      date: event.date,
      time: event.time,
      venue: event.venue.name,
      interval: 'one-time'
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-4 text-lg">Loading event details...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center py-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Event</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>
      );
    }

    if (!event) {
      return (
        <div className="flex flex-col items-center py-20">
          <AlertCircle className="h-12 w-12 text-warning mb-4" />
          <h3 className="text-xl font-semibold mb-2">Event Not Found</h3>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 space-y-6">
            {/* Event Details */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            {/* Event Information */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h4 className="font-medium">Date</h4>
                  <p className="text-gray-700">{event.date}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h4 className="font-medium">Time</h4>
                  <p className="text-gray-700">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-gray-700">{event.venue.name}</p>
                  <p className="text-gray-500 text-sm">{event.venue.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h4 className="font-medium">Capacity</h4>
                  <p className="text-gray-700">{event.attendees.capacity} attendees</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets Section */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Tickets</h3>
                {event.ticketTypes.length > 0 ? (
                  <div className="space-y-4">
                    {event.ticketTypes.map((ticket) => (
                      <div key={ticket.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{ticket.name}</h4>
                          <Badge variant="outline">{formatCurrency(ticket.price)}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                        <Button 
                          onClick={() => handleBuyTicket(ticket)}
                          className="w-full"
                        >
                          Buy Ticket
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 italic">No tickets available for this event.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <DetailPageMasthead 
          title={isLoading ? 'Loading...' : event?.name || 'Event Not Found'} 
          subtitle={isLoading ? '' : event?.venue.name || ''}
          imageUrl={event?.image_url}
        />
        
        {renderContent()}
      </div>
    </Layout>
  );
};

export default EventDetailPage;

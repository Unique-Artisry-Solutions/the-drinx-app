
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useEventQueries } from '@/hooks/events/useEventQueries';
import EventCard from '@/components/promoter/events/EventCard';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { EventStatus } from '@/types/EventTypes';

const EventsPage = () => {
  const { events, isLoading } = useEventQueries();
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [statusFilter, setStatusFilter] = useState<EventStatus | undefined>(undefined);
  const { user } = useAuth();
  
  // Filter events based on selected filter
  const filteredEvents = React.useMemo(() => {
    if (!events) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case 'upcoming':
        return events.filter(event => new Date(event.date) >= today);
      case 'past':
        return events.filter(event => new Date(event.date) < today);
      default:
        return events;
    }
  }, [events, filter]);

  const handleStatusFilter = (status: string) => {
    // Convert string status to EventStatus type
    let eventStatus: EventStatus | undefined;
    
    switch (status) {
      case 'draft':
        eventStatus = 'draft';
        break;
      case 'published':
        eventStatus = 'published';
        break;
      case 'cancelled':
        eventStatus = 'cancelled';
        break;
      case 'completed':
        eventStatus = 'completed';
        break;
      default:
        eventStatus = undefined;
        break;
    }
    
    setStatusFilter(eventStatus);
  };

  return (
    <Layout>
      <div className="animate-fade-in max-w-7xl mx-auto px-3 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Events</h1>
            <p className="text-muted-foreground">
              Discover and attend spirit-free events
            </p>
          </div>
          
          <div className="flex gap-2 mt-3 sm:mt-0">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('past')}
            >
              Past
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              // Extract venue name safely
              const venueName = event.venue_id 
                ? (event.venue?.name || 'TBD') 
                : 'TBD';
              
              // Calculate registered attendees safely
              const attendeeCount = event.attendees?.registered || 0;
              
              // Distance is also not available yet
              const distance = undefined;
              
              // Determine the correct link path based on user type
              const linkBasePath = user?.user_metadata?.user_type === 'promoter' 
                ? '/promoter/events' 
                : '/event';
              
              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  name={event.name}
                  date={new Date(event.date).toLocaleDateString()}
                  time={event.time}
                  venue={venueName}
                  status={event.status}
                  imageUrl={event.image_url}
                  attendeeCount={attendeeCount}
                  distance={distance}
                  linkBasePath={linkBasePath}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center border rounded-lg bg-gray-50">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {filter === 'upcoming' 
                ? 'There are no upcoming events at the moment.' 
                : filter === 'past'
                ? 'No past events to display.' 
                : 'No events have been created yet.'}
            </p>
            {user && user?.user_metadata?.user_type === 'promoter' && (
              <Button className="mt-4" asChild>
                <a href="/promoter/events/create">Create an Event</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;

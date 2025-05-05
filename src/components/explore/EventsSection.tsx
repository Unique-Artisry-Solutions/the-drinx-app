
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/promoter/events/EventCard';
import { EventType } from '@/types/EventTypes';
import { useEventQueries } from '@/hooks/events/useEventQueries';

interface EventsSectionProps {
  events?: EventType[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events: propEvents }) => {
  const { events: fetchedEvents, isLoading } = useEventQueries();
  const events = propEvents || fetchedEvents || [];
  
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="mb-6 p-5 bg-gradient-to-r from-purple-100/20 to-blue-100/20 rounded-lg border border-purple-200/30 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Upcoming Events</h2>
          <p className="text-sm text-muted-foreground">
            Discover spirit-free events in your area
          </p>
        </div>
        
        <div className="flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-purple-500 text-purple-700 flex-1 sm:flex-none"
            asChild
          >
            <Link to="/events" onClick={scrollToTop}>
              <Calendar className="h-4 w-4" />
              <span>All Events</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.slice(0, 3).map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              date={new Date(event.date).toLocaleDateString()}
              time={event.time}
              venue={event.venue?.name || 'TBD'}
              status={event.status}
              imageUrl={event.image_url}
              attendeeCount={event.attendees?.registered || 0}
              distance={event.distance}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <h3 className="text-lg font-medium text-gray-500">No upcoming events</h3>
          <p className="text-sm text-muted-foreground mt-2">Check back soon for new events</p>
        </div>
      )}
    </div>
  );
};

export default EventsSection;

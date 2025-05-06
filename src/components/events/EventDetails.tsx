
import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Event } from '@/types/EventTypes';
import ShareScannerButton from '@/components/events/ShareScannerButton';
import EventCancellationButton from '@/components/events/EventCancellationButton';

interface EventDetailsProps {
  event: Event;
  eventId: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, eventId }) => {
  return (
    <CardContent>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Event Details</h3>
          <p>{event.description}</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{event.venue?.name}, {event.venue?.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{event.attendees?.registered} Registered</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Actions</h3>
          <div className="space-y-2">
            <ShareScannerButton eventId={eventId || ''} eventName={event.name} />
            {event.status !== 'cancelled' && (
              <EventCancellationButton eventId={eventId} />
            )}
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default EventDetails;

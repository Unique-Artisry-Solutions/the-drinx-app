
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  imageUrl?: string;
}

export interface UpcomingEventsWidgetProps {
  events?: UpcomingEvent[];
}

const defaultEvents: UpcomingEvent[] = [
  {
    id: '1',
    title: 'Mocktail Mixology Workshop',
    description: 'Learn to craft the perfect virgin cocktails',
    date: 'Dec 15',
    time: '7:00 PM',
    location: 'The Mocktail Lounge',
    attendees: 12
  },
  {
    id: '2',
    title: 'Sober Social Hour',
    description: 'Weekly community meetup',
    date: 'Dec 17',
    time: '6:00 PM',
    location: 'Sober Social Club',
    attendees: 8
  }
];

export const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({ 
  events = defaultEvents 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-3 rounded-lg border">
              <h4 className="font-medium text-sm mb-1">{event.title}</h4>
              <p className="text-xs text-muted-foreground mb-3">{event.description}</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full text-xs h-6">
                Join Event
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

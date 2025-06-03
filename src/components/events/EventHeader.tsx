
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { Event } from '@/types/EventTypes';

interface EventHeaderProps {
  event: Event;
}

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">{event.name}</CardTitle>
        <div className="flex items-center space-x-2">
          {event.status && (
            <Badge variant="secondary">{event.status}</Badge>
          )}
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
      <CardDescription>
        {event.date} at {event.time} - {event.venue?.name}
      </CardDescription>
    </CardHeader>
  );
};

export default EventHeader;

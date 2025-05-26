
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { UpcomingEvent } from '@/hooks/usePersonalizedData';

interface UpcomingEventsWidgetProps {
  events: UpcomingEvent[];
}

const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({ events }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-foreground">{event.title}</h3>
                <Badge variant="outline">{event.type}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsWidget;

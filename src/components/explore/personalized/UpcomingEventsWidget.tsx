
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  attendees: number;
  image?: string;
  price?: string;
  category: string;
}

interface UpcomingEventsWidgetProps {
  events: Event[];
}

const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({ events }) => {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      workshop: 'bg-purple-100 text-purple-700 border-purple-200',
      tasting: 'bg-blue-100 text-blue-700 border-blue-200',
      social: 'bg-green-100 text-green-700 border-green-200',
      competition: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[category as keyof typeof colors] || colors.social;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/events">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length > 0 ? (
          events.slice(0, 4).map((event) => (
            <div 
              key={event.id} 
              className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-1">{event.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getCategoryColor(event.category)}`}
                      >
                        {event.category}
                      </Badge>
                      {event.price && (
                        <span className="text-xs font-medium text-primary">{event.price}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium">{formatEventDate(event.date)}</div>
                    <div className="text-xs text-muted-foreground">{event.time}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{event.attendees} going</span>
                  </div>
                </div>
                
                <div className="flex justify-end pt-1">
                  <Button variant="ghost" size="sm" asChild className="text-xs h-auto p-1">
                    <Link to={`/event/${event.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming events</p>
            <p className="text-xs">Check back soon for new events!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsWidget;

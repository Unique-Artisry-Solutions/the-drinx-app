
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface EventCardProps {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  attendeeCount: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  imageUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  name,
  date,
  time,
  venue,
  attendeeCount,
  status,
  imageUrl
}) => {
  // Status colors
  const statusConfig = {
    draft: { color: 'bg-gray-200 text-gray-800', text: 'Draft' },
    published: { color: 'bg-green-200 text-green-800', text: 'Published' },
    cancelled: { color: 'bg-red-200 text-red-800', text: 'Cancelled' },
    completed: { color: 'bg-blue-200 text-blue-800', text: 'Completed' }
  };

  return (
    <Link to={`/promoter/events/${id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className={cn(statusConfig[status].color)}>
              {statusConfig[status].text}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{date}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{time}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{venue}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{attendeeCount} attendees</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;

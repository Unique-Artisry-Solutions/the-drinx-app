
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  id: string;
  name: string;
  description: string;
  date: string;
  imageUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  id, 
  name, 
  description, 
  date, 
  imageUrl
}) => {
  return (
    <Link to={`/events/${id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{date}</span>
            </div>
            
            <p className="text-sm line-clamp-2 text-muted-foreground">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;

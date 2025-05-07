
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from '@/utils/locationUtils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface EventCardProps {
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
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
          
          <div className="text-sm text-gray-600 mb-2">
            <span>{date}</span>
          </div>
          
          <p className="text-sm text-gray-700 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

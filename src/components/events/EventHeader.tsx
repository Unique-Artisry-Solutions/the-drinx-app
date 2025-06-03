
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card'; // Commented out to preserve future functionality
import { Calendar, MapPin, Users, Clock, Share2, Edit } from 'lucide-react';
import { Event } from '@/types/EventTypes';

interface EventHeaderProps {
  event: Event;
  onEdit?: () => void;
  onShare?: () => void;
}

const EventHeader: React.FC<EventHeaderProps> = ({ event, onEdit, onShare }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            {event.status && (
              <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            )}
          </div>
          
          {event.description && (
            <p className="text-lg text-gray-600 mb-4">{event.description}</p>
          )}
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {onShare && (
            <Button variant="outline" onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-5 h-5 mr-3 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Date</p>
            <p>{event.date}</p>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock className="w-5 h-5 mr-3 text-green-500" />
          <div>
            <p className="text-sm font-medium">Time</p>
            <p>{event.time}</p>
          </div>
        </div>
        
        {event.location_details?.venue && (
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-3 text-red-500" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p>{event.location_details.venue}</p>
            </div>
          </div>
        )}
        
        {event.capacity && (
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-3 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Capacity</p>
              <p>{event.capacity} attendees</p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      {(event.event_type || event.contact_info) && (
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.event_type && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Event Type</p>
                <Badge variant="outline">{event.event_type}</Badge>
              </div>
            )}
            
            {event.contact_info?.email && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Contact</p>
                <p className="text-sm text-gray-600">{event.contact_info.email}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHeader;

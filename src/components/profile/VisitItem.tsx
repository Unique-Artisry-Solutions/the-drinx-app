
import React from 'react';
import { format } from 'date-fns';
import { MapPin, Clock, Star, MessageSquare, Coffee } from 'lucide-react';
import { RewardTransaction } from '@/types/rewards/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VisitItemProps {
  visit: RewardTransaction;
  onViewDetails?: (visit: RewardTransaction) => void;
}

const VisitItem: React.FC<VisitItemProps> = ({ visit, onViewDetails }) => {
  const visitDate = new Date(visit.created_at);
  const metadata = visit.metadata as any || {};
  const entityName = metadata.entity_name || 'Unknown Location';
  const rating = metadata.rating;
  const note = metadata.note;
  const durationType = metadata.check_in_type || 'establishment';
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{entityName}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin size={14} className="mr-1" />
              <span>{durationType} check-in</span>
            </div>
          </div>
          {rating && (
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-3 text-sm text-gray-600">
          <Clock size={14} className="mr-1" />
          <span className="mr-3">
            {format(visitDate, 'MMM d, yyyy')} at {format(visitDate, 'h:mm a')}
          </span>
          
          {metadata.duration_minutes && (
            <span className="mr-3">
              • {metadata.duration_minutes} min
            </span>
          )}
          
          {note && (
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              <span>Note added</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <Coffee size={14} className="mr-1 text-indigo-500" />
            <span className="text-sm font-medium">+{visit.points} points earned</span>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            {visit.source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
        
        {note && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
            <span className="font-medium">Note: </span>
            {note}
          </div>
        )}
        
        {onViewDetails && (
          <button 
            onClick={() => onViewDetails(visit)}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View Details
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default VisitItem;

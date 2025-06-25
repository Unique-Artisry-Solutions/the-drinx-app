
import React from 'react';
import { format } from 'date-fns';
import { MapPin, Clock, Star, MessageSquare, Coffee } from 'lucide-react';
import { VisitWithEstablishment } from '@/types/VisitTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VisitItemProps {
  visit: VisitWithEstablishment;
  onViewDetails?: (visit: VisitWithEstablishment) => void;
}

const VisitItem: React.FC<VisitItemProps> = ({ visit, onViewDetails }) => {
  const establishment = visit.establishment;
  const visitDate = new Date(visit.visit_date);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{establishment.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin size={14} className="mr-1" />
              <span>{establishment.address}</span>
            </div>
          </div>
          {visit.rating && (
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < visit.rating! ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
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
          
          {visit.duration_minutes && (
            <span className="mr-3">
              • {visit.duration_minutes} min
            </span>
          )}
          
          {visit.notes.length > 0 && (
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              <span>{visit.notes.length}</span>
            </div>
          )}
        </div>
        
        {visit.tried_mocktails.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center mb-1 text-xs font-medium">
              <Coffee size={14} className="mr-1 text-indigo-500" />
              <span>Tried Mocktails</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {visit.tried_mocktails.map((mocktail) => (
                <Badge key={mocktail.id} variant="secondary" className="text-xs">
                  {mocktail.cocktail_id.substring(0, 8)}
                  {mocktail.rating && (
                    <span className="ml-1">
                      ({mocktail.rating}★)
                    </span>
                  )}
                </Badge>
              ))}
            </div>
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
